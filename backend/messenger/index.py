import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

S = "t_p59951426_yura_messenger_creat"

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def ok(data, status=200):
    return {
        "statusCode": status,
        "headers": {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
        "body": json.dumps(data, default=str)
    }

def err(msg, status=400):
    return {
        "statusCode": status,
        "headers": {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
        "body": json.dumps({"error": msg})
    }

def handler(event: dict, context) -> dict:
    """Основной API мессенджера: чаты, сообщения, уведомления, профиль"""
    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, X-User-Id, X-Auth-Token, X-Session-Id",
                "Access-Control-Max-Age": "86400"
            },
            "body": ""
        }

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    params = event.get("queryStringParameters") or {}
    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    current_user_id = int(params.get("user_id", 1))

    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    if path == "/" and method == "GET":
        action = params.get("action", "chats")

        if action == "chats":
            cur.execute(f"""
                SELECT DISTINCT ON (c.id)
                    c.id,
                    c.type,
                    CASE
                        WHEN c.type = 'group' THEN c.name
                        ELSE u2.display_name
                    END AS name,
                    CASE
                        WHEN c.type = 'group' THEN LEFT(c.name, 1)
                        ELSE u2.avatar_letter
                    END AS avatar,
                    CASE
                        WHEN c.type = 'group' THEN FALSE
                        ELSE (u2.status = 'online')
                    END AS online,
                    m.text AS last_message,
                    m.created_at AS last_message_time,
                    (
                        SELECT COUNT(*) FROM {S}.messages msg2
                        WHERE msg2.chat_id = c.id
                        AND msg2.sender_id != %(uid)s
                        AND msg2.created_at > COALESCE((
                            SELECT MAX(created_at) FROM {S}.messages
                            WHERE chat_id = c.id AND sender_id = %(uid)s
                        ), '1970-01-01'::timestamptz)
                    ) AS unread
                FROM {S}.chats c
                JOIN {S}.chat_members cm ON cm.chat_id = c.id AND cm.user_id = %(uid)s
                LEFT JOIN {S}.chat_members cm2 ON cm2.chat_id = c.id AND cm2.user_id != %(uid)s
                LEFT JOIN {S}.users u2 ON u2.id = cm2.user_id
                LEFT JOIN LATERAL (
                    SELECT text, created_at FROM {S}.messages
                    WHERE chat_id = c.id
                    ORDER BY created_at DESC LIMIT 1
                ) m ON TRUE
                ORDER BY c.id, m.created_at DESC NULLS LAST
            """, {"uid": current_user_id})
            chats = cur.fetchall()
            chats_sorted = sorted([dict(c) for c in chats], key=lambda x: x.get("last_message_time") or "", reverse=True)
            cur.close(); conn.close()
            return ok({"chats": chats_sorted})

        if action == "messages":
            chat_id = int(params.get("chat_id", 0))
            cur.execute(f"""
                SELECT m.id, m.text, m.created_at, m.sender_id,
                       u.display_name AS sender_name,
                       (m.sender_id = %s) AS is_mine
                FROM {S}.messages m
                JOIN {S}.users u ON u.id = m.sender_id
                WHERE m.chat_id = %s
                ORDER BY m.created_at ASC
            """, (current_user_id, chat_id))
            msgs = cur.fetchall()
            cur.close(); conn.close()
            return ok({"messages": [dict(m) for m in msgs]})

        if action == "notifications":
            cur.execute(f"""
                SELECT id, type, title, body, is_read, related_chat_id, created_at
                FROM {S}.notifications
                WHERE user_id = %s
                ORDER BY created_at DESC
            """, (current_user_id,))
            notifs = cur.fetchall()
            cur.close(); conn.close()
            return ok({"notifications": [dict(n) for n in notifs]})

        if action == "profile":
            cur.execute(f"SELECT * FROM {S}.users WHERE id = %s", (current_user_id,))
            user = cur.fetchone()
            cur.close(); conn.close()
            if not user:
                return err("User not found", 404)
            return ok({"user": dict(user)})

        if action == "contacts":
            cur.execute(f"""
                SELECT id, display_name, avatar_letter, bio, status
                FROM {S}.users WHERE id != %s ORDER BY display_name
            """, (current_user_id,))
            users = cur.fetchall()
            cur.close(); conn.close()
            return ok({"users": [dict(u) for u in users]})

        cur.close(); conn.close()
        return err("Unknown action")

    if path == "/" and method == "POST":
        action = body.get("action")

        if action == "send_message":
            chat_id = body.get("chat_id")
            text = body.get("text", "").strip()
            if not text or not chat_id:
                cur.close(); conn.close()
                return err("chat_id and text required")
            cur.execute(f"""
                INSERT INTO {S}.messages (chat_id, sender_id, text)
                VALUES (%s, %s, %s) RETURNING id, created_at
            """, (chat_id, current_user_id, text))
            row = cur.fetchone()
            conn.commit()
            cur.close(); conn.close()
            return ok({"id": row["id"], "created_at": row["created_at"]})

        if action == "mark_read":
            cur.execute(f"""
                UPDATE {S}.notifications SET is_read = TRUE
                WHERE user_id = %s AND is_read = FALSE
            """, (current_user_id,))
            conn.commit()
            cur.close(); conn.close()
            return ok({"ok": True})

        if action == "update_profile":
            display_name = body.get("display_name")
            bio = body.get("bio", "")
            phone = body.get("phone", "")
            if not display_name:
                cur.close(); conn.close()
                return err("display_name required")
            cur.execute(f"""
                UPDATE {S}.users SET display_name = %s, bio = %s, phone = %s
                WHERE id = %s
            """, (display_name, bio, phone, current_user_id))
            conn.commit()
            cur.close(); conn.close()
            return ok({"ok": True})

        cur.close(); conn.close()
        return err("Unknown action")

    cur.close(); conn.close()
    return err("Not found", 404)