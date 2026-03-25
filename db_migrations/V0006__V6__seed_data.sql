INSERT INTO users (username, display_name, avatar_letter, bio, phone, status) VALUES
  ('alexey', 'Алексей', 'А', 'Люблю технологии и кофе', '+7 999 123-45-67', 'online'),
  ('maria', 'Мария Соколова', 'М', 'Дизайнер', '+7 999 234-56-78', 'online'),
  ('dmitry', 'Дмитрий Орлов', 'Д', 'Разработчик', '+7 999 345-67-89', 'offline'),
  ('anna', 'Анна Петрова', 'А', 'Менеджер', '+7 999 456-78-90', 'online'),
  ('sergey', 'Сергей Морозов', 'С', 'Аналитик', '+7 999 567-89-01', 'offline'),
  ('natasha', 'Наташа Иванова', 'Н', 'Маркетинг', '+7 999 678-90-12', 'offline');

INSERT INTO chats (type, name) VALUES
  ('direct', NULL),
  ('direct', NULL),
  ('group', 'Команда проекта'),
  ('direct', NULL),
  ('direct', NULL),
  ('direct', NULL);

INSERT INTO chat_members (chat_id, user_id) VALUES
  (1, 1), (1, 2),
  (2, 1), (2, 3),
  (3, 1), (3, 2), (3, 4),
  (4, 1), (4, 4),
  (5, 1), (5, 5),
  (6, 1), (6, 6);

INSERT INTO messages (chat_id, sender_id, text, created_at) VALUES
  (1, 2, 'Привет! Как дела?', NOW() - INTERVAL '2 hours'),
  (1, 1, 'Привет! Отлично, спасибо. Ты как?', NOW() - INTERVAL '1 hour 58 minutes'),
  (1, 2, 'Тоже хорошо. Не забыл про встречу?', NOW() - INTERVAL '1 hour 55 minutes'),
  (1, 1, 'Нет, помню! В 18:00 у метро, верно?', NOW() - INTERVAL '1 hour 52 minutes'),
  (1, 2, 'Да, именно. Захвати зонт — обещают дождь', NOW() - INTERVAL '1 hour 50 minutes'),
  (1, 2, 'Хорошо, встретимся в 18:00 у метро', NOW() - INTERVAL '1 hour 28 minutes'),
  (2, 3, 'Посмотрел файл — всё выглядит отлично', NOW() - INTERVAL '2 hours 50 minutes'),
  (3, 4, 'Презентация готова, жду правок', NOW() - INTERVAL '3 hours 5 minutes'),
  (4, 4, 'Спасибо за помощь! Очень выручил', NOW() - INTERVAL '1 day'),
  (5, 5, 'Завтра созвонимся по проекту', NOW() - INTERVAL '1 day 2 hours'),
  (6, 6, 'Ок, договорились!', NOW() - INTERVAL '3 days');

INSERT INTO notifications (user_id, type, title, body, is_read, related_chat_id, created_at) VALUES
  (1, 'message', 'Мария Соколова', 'Хорошо, встретимся в 18:00 у метро', FALSE, 1, NOW() - INTERVAL '1 hour 28 minutes'),
  (1, 'message', 'Команда проекта', 'Презентация готова, жду правок', FALSE, 3, NOW() - INTERVAL '3 hours 5 minutes'),
  (1, 'message', 'Команда проекта', '5 новых сообщений', FALSE, 3, NOW() - INTERVAL '3 hours 10 minutes'),
  (1, 'system', 'Шифрование активно', 'Все сообщения защищены end-to-end', TRUE, NULL, NOW() - INTERVAL '1 day');