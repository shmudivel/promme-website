-- PROMME Database Seed Data
-- ==========================
-- Version: 1.0
-- Description: Inserts sample data for development and testing
-- WARNING: Only run this in development environment!

-- ============================================
-- CLEAR EXISTING DATA (Development Only!)
-- ============================================

TRUNCATE TABLE activity_logs, user_sessions, notifications, chat_participants, 
    chat_messages, chats, saved_vacancies, applications, vacancies, resumes, 
    profile_videos, profile_photos, profiles, user_settings, users CASCADE;

-- ============================================
-- USERS
-- ============================================

-- Job Seekers
INSERT INTO users (id, email, password_hash, profile_type, is_verified, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'ivan.petrov@example.com', '$2a$10$YourHashedPasswordHere1', 'job-seeker', true, true),
('22222222-2222-2222-2222-222222222222', 'maria.ivanova@example.com', '$2a$10$YourHashedPasswordHere2', 'job-seeker', true, true),
('33333333-3333-3333-3333-333333333333', 'alex.smirnov@example.com', '$2a$10$YourHashedPasswordHere3', 'job-seeker', true, true);

-- Companies
INSERT INTO users (id, email, password_hash, profile_type, is_verified, is_active) VALUES
('44444444-4444-4444-4444-444444444444', 'hr@uralmash.ru', '$2a$10$YourHashedPasswordHere4', 'company', true, true),
('55555555-5555-5555-5555-555555555555', 'jobs@chelpipe.ru', '$2a$10$YourHashedPasswordHere5', 'company', true, true);

-- Educational Institution
INSERT INTO users (id, email, password_hash, profile_type, is_verified, is_active) VALUES
('66666666-6666-6666-6666-666666666666', 'info@techcollege.ru', '$2a$10$YourHashedPasswordHere6', 'facilitator', true, true);

-- ============================================
-- PROFILES - Job Seekers
-- ============================================

INSERT INTO profiles (user_id, full_name, phone, position, experience_years, education, skills, about_me, city, country, profile_completion_percentage, is_profile_filled) VALUES
('11111111-1111-1111-1111-111111111111', 
 'Иван Петров', 
 '+7 (999) 123-45-67', 
 'Сварщик 5 разряда', 
 12, 
 'Среднее профессиональное, Уральский технический колледж', 
 'РДС, МАГ, ТИГ, чтение чертежей, контроль качества, сварка труб', 
 'Опытный сварщик с 12-летним стажем работы на промышленных предприятиях. Имею удостоверение НАКС, опыт работы с различными материалами и методами сварки.',
 'Екатеринбург',
 'Россия',
 95,
 true
);

INSERT INTO profiles (user_id, full_name, phone, position, experience_years, education, skills, about_me, city, country, profile_completion_percentage, is_profile_filled) VALUES
('22222222-2222-2222-2222-222222222222', 
 'Мария Иванова', 
 '+7 (999) 234-56-78', 
 'Инженер-технолог', 
 5, 
 'Высшее техническое, Московский государственный технический университет', 
 'AutoCAD, SolidWorks, разработка технологических процессов, контроль качества', 
 'Инженер-технолог с опытом разработки производственных процессов и внедрения новых технологий.',
 'Москва',
 'Россия',
 90,
 true
);

INSERT INTO profiles (user_id, full_name, phone, position, experience_years, education, skills, about_me, city, country, profile_completion_percentage, is_profile_filled) VALUES
('33333333-3333-3333-3333-333333333333', 
 'Александр Смирнов', 
 '+7 (999) 345-67-89', 
 'Оператор станков с ЧПУ', 
 3, 
 'Среднее профессиональное, Челябинский механический техникум', 
 'Программирование ЧПУ, Fanuc, Siemens, настройка оборудования', 
 'Молодой специалист с опытом работы на современном оборудовании с ЧПУ.',
 'Челябинск',
 'Россия',
 80,
 true
);

-- ============================================
-- PROFILES - Companies
-- ============================================

INSERT INTO profiles (user_id, full_name, company_name, company_description, company_size, industry, website, city, country) VALUES
('44444444-4444-4444-4444-444444444444',
 'ООО Уралмашзавод',
 'ООО "Уралмашзавод"',
 'Ведущее машиностроительное предприятие Урала. Производство металлургического и горного оборудования.',
 '1000-5000',
 'Машиностроение',
 'https://uralmash.ru',
 'Екатеринбург',
 'Россия'
);

INSERT INTO profiles (user_id, full_name, company_name, company_description, company_size, industry, website, city, country) VALUES
('55555555-5555-5555-5555-555555555555',
 'АО ЧТПЗ',
 'АО "Челябинский трубопрокатный завод"',
 'Один из крупнейших производителей труб в России. Современное производство, высокие стандарты качества.',
 '5000+',
 'Металлургия',
 'https://chelpipe.ru',
 'Челябинск',
 'Россия'
);

-- ============================================
-- PROFILES - Educational Institution
-- ============================================

INSERT INTO profiles (user_id, full_name, company_name, company_description, company_size, website, city, country) VALUES
('66666666-6666-6666-6666-666666666666',
 'Уральский технический колледж',
 'Уральский технический колледж',
 'Профессиональное образование по техническим специальностям. Современная материально-техническая база.',
 '100-500',
 'https://ural-tech.edu.ru',
 'Екатеринбург',
 'Россия'
);

-- ============================================
-- VACANCIES
-- ============================================

INSERT INTO vacancies (id, company_id, title, description, requirements, responsibilities, benefits, 
    position_level, experience_required, employment_type, work_schedule,
    salary_min, salary_max, salary_currency, city, country, status, published_at, slug) VALUES
('77777777-7777-7777-7777-777777777777',
 '44444444-4444-4444-4444-444444444444',
 'Сварщик 5 разряда',
 'Ведущее промышленное предприятие Уральского региона приглашает опытного сварщика 5 разряда для работы на производстве металлоконструкций. Предлагаем стабильную работу, достойную заработную плату и полный социальный пакет.',
 '["Опыт работы сварщиком от 5 лет", "Удостоверение сварщика 5 разряда (НАКС)", "Владение методами РДС, МАГ, ТИГ", "Умение читать чертежи", "Ответственность и внимательность"]'::jsonb,
 '["Выполнение сварочных работ на металлоконструкциях", "Контроль качества сварных швов", "Работа по техническим картам", "Соблюдение техники безопасности"]'::jsonb,
 '["Заработная плата от 80 000 до 120 000 рублей", "Официальное трудоустройство", "Полный социальный пакет", "Спецодежда и оборудование", "Корпоративное питание", "Возможность карьерного роста"]'::jsonb,
 'Специалист',
 'От 5 лет',
 'full-time',
 'Полная занятость',
 80000,
 120000,
 'RUB',
 'Екатеринбург',
 'Россия',
 'active',
 CURRENT_TIMESTAMP,
 'svarschik-5-razryada-uralmash'
);

INSERT INTO vacancies (id, company_id, title, description, requirements, responsibilities, benefits,
    position_level, experience_required, employment_type, work_schedule,
    salary_min, salary_max, salary_currency, city, country, status, published_at, slug) VALUES
('88888888-8888-8888-8888-888888888888',
 '55555555-5555-5555-5555-555555555555',
 'Сварщик 4 разряда',
 'Крупное металлургическое предприятие ищет квалифицированного сварщика для работы на производстве труб большого диаметра.',
 '["Опыт работы от 3 лет", "Удостоверение сварщика 4 разряда", "Опыт сварки труб", "Знание методов РДС, МАГ"]'::jsonb,
 '["Сварка трубных изделий", "Контроль швов", "Работа по чертежам"]'::jsonb,
 '["Стабильная зарплата 70-100 тыс. руб", "Официальное оформление", "Медицинская страховка", "Бесплатное питание"]'::jsonb,
 'Специалист',
 'От 3 лет',
 'full-time',
 'Полная занятость',
 70000,
 100000,
 'RUB',
 'Челябинск',
 'Россия',
 'active',
 CURRENT_TIMESTAMP,
 'svarschik-4-razryada-chelpipe'
);

INSERT INTO vacancies (id, company_id, title, description, requirements, responsibilities, benefits,
    position_level, experience_required, employment_type, work_schedule,
    salary_min, salary_max, salary_currency, city, country, status, published_at, slug) VALUES
('99999999-9999-9999-9999-999999999999',
 '44444444-4444-4444-4444-444444444444',
 'Инженер-технолог',
 'Требуется инженер-технолог для разработки технологических процессов и контроля производства.',
 '["Высшее техническое образование", "Опыт работы от 2 лет", "Знание AutoCAD, SolidWorks", "Навыки работы с технической документацией"]'::jsonb,
 '["Разработка технологических процессов", "Контроль качества продукции", "Оптимизация производства"]'::jsonb,
 '["Конкурентная зарплата", "Полный соцпакет", "ДМС", "Обучение за счет компании"]'::jsonb,
 'Специалист',
 'От 2 лет',
 'full-time',
 'Полная занятость',
 90000,
 150000,
 'RUB',
 'Екатеринбург',
 'Россия',
 'active',
 CURRENT_TIMESTAMP,
 'inzhener-tehnolog-uralmash'
);

-- ============================================
-- APPLICATIONS
-- ============================================

INSERT INTO applications (vacancy_id, user_id, cover_letter, status, match_percentage, submitted_at) VALUES
('77777777-7777-7777-7777-777777777777',
 '11111111-1111-1111-1111-111111111111',
 'Уважаемые работодатели! Меня заинтересовала ваша вакансия "Сварщик 5 разряда". Имею 12-летний опыт работы сварщиком, владею всеми необходимыми методами сварки. Готов приступить к работе в ближайшее время.',
 'pending',
 95,
 CURRENT_TIMESTAMP - INTERVAL '2 days'
);

-- ============================================
-- SAVED VACANCIES
-- ============================================

INSERT INTO saved_vacancies (user_id, vacancy_id, notes) VALUES
('22222222-2222-2222-2222-222222222222',
 '99999999-9999-9999-9999-999999999999',
 'Интересная позиция, подходит по опыту'
);

-- ============================================
-- CHATS
-- ============================================

-- Direct chat between job seeker and company
INSERT INTO chats (id, chat_type, user1_id, user2_id, vacancy_id, application_id, last_message_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
 'direct',
 '11111111-1111-1111-1111-111111111111',
 '44444444-4444-4444-4444-444444444444',
 '77777777-7777-7777-7777-777777777777',
 NULL,
 CURRENT_TIMESTAMP
);

-- ============================================
-- CHAT MESSAGES
-- ============================================

INSERT INTO chat_messages (id, chat_id, sender_id, message_type, message_text, is_read, sent_at) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
 '44444444-4444-4444-4444-444444444444',
 'text',
 'Здравствуйте! Мы рассмотрели вашу заявку на вакансию "Сварщик 5 разряда". Хотели бы пригласить вас на собеседование.',
 true,
 CURRENT_TIMESTAMP - INTERVAL '1 day'
);

INSERT INTO chat_messages (chat_id, sender_id, message_type, message_text, is_read, sent_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
 '11111111-1111-1111-1111-111111111111',
 'text',
 'Здравствуйте! Большое спасибо за ответ. Я готов приехать на собеседование. Когда вам удобно?',
 true,
 CURRENT_TIMESTAMP - INTERVAL '12 hours'
);

INSERT INTO chat_messages (chat_id, sender_id, message_type, message_text, is_read, sent_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
 '44444444-4444-4444-4444-444444444444',
 'text',
 'Отлично! Приглашаем вас завтра в 10:00 по адресу: ул. Машиностроителей, д. 19. С собой паспорт и документы об образовании.',
 false,
 CURRENT_TIMESTAMP - INTERVAL '6 hours'
);

-- Update last_message_id in chat
UPDATE chats SET last_message_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' 
WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- ============================================
-- NOTIFICATIONS
-- ============================================

INSERT INTO notifications (user_id, notification_type, title, message, related_entity_type, related_entity_id, action_url, is_read) VALUES
('11111111-1111-1111-1111-111111111111',
 'application',
 'Ваша заявка получена',
 'Ваша заявка на вакансию "Сварщик 5 разряда" получена работодателем',
 'application',
 NULL,
 '/applications',
 true
);

INSERT INTO notifications (user_id, notification_type, title, message, related_entity_type, related_entity_id, action_url, is_read) VALUES
('11111111-1111-1111-1111-111111111111',
 'message',
 'Новое сообщение',
 'Вам пришло новое сообщение от ООО "Уралмашзавод"',
 'chat',
 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
 '/chats/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
 false
);

-- ============================================
-- USER SETTINGS
-- ============================================

INSERT INTO user_settings (user_id) VALUES
('11111111-1111-1111-1111-111111111111'),
('22222222-2222-2222-2222-222222222222'),
('33333333-3333-3333-3333-333333333333'),
('44444444-4444-4444-4444-444444444444'),
('55555555-5555-5555-5555-555555555555'),
('66666666-6666-6666-6666-666666666666');

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

SELECT 'Seed data inserted successfully!' as message,
       (SELECT COUNT(*) FROM users) as users_count,
       (SELECT COUNT(*) FROM profiles) as profiles_count,
       (SELECT COUNT(*) FROM vacancies) as vacancies_count,
       (SELECT COUNT(*) FROM applications) as applications_count,
       (SELECT COUNT(*) FROM chats) as chats_count,
       (SELECT COUNT(*) FROM chat_messages) as messages_count;

