-- ============ Site Settings ============
INSERT OR REPLACE INTO site_settings (key, value) VALUES
  ('site_title', 'ByteEgypt | بايت مصر — مجتمع طلاب الحاسبات في مصر'),
  ('site_description', 'ByteEgypt مجتمع مغلق لطلاب كليات الحاسبات والمعلومات والذكاء الاصطناعي في مصر.'),
  ('invite_link', 'https://discord.gg/kGj7yGmVU'),
  ('brand_name_en', 'ByteEgypt'),
  ('brand_name_ar', 'بايت مصر'),

  -- Hero
  ('hero_badge', 'مجتمعنا لسه بادئ — كن من أول الأعضاء'),
  ('hero_subtitle', 'مجتمع <strong>مغلق</strong> لطلاب <span class="highlight">كليات الحاسبات والمعلومات والذكاء الاصطناعي</span> في مصر — مكان بنبني فيه علاقاتنا، نستفيد سوا، ونحضّر نفسنا لسوق الشغل بعيداً عن رغي ومشتتات جروبات الفيسبوك.'),
  ('hero_cta_primary', 'انضم للمجتمع الآن'),
  ('hero_cta_secondary', 'اعرف أكتر'),
  ('hero_trust_1', 'مجتمع مغلق وخاص'),
  ('hero_trust_2', 'لطلاب الحاسبات بس'),
  ('hero_trust_3', 'الانضمام مجاني'),

  -- Discord intro
  ('discord_eyebrow', 'للي مش عارف Discord'),
  ('discord_title', 'إيه هو <span class="gradient-text">Discord</span> أصلاً؟'),
  ('discord_sub', 'ديسكورد تطبيق مجاني (موقع + موبايل + كمبيوتر) بيخليك تدخل "مجتمعات" — كل مجتمع فيه قنوات للكتابة وقنوات صوت. تخيل واتساب + جروب فيسبوك + كول صوتي، كله في حتة واحدة منظمة.'),
  ('discord_card1_title', 'مجاني تماماً'),
  ('discord_card1_desc', 'التطبيق مجاني على كل الأجهزة، مش محتاج تدفع أي حاجة عشان تستخدمه أو تدخل مجتمعنا.'),
  ('discord_card2_title', 'دردشة وصوت'),
  ('discord_card2_desc', 'تقدر تكتب، تتكلم صوت، أو تشارك شاشتك مع زمايلك بسهولة، سواء للمذاكرة أو الشغل.'),
  ('discord_card3_title', 'قنوات منظمة'),
  ('discord_card3_desc', 'كل موضوع له قناة خاصة بيه: مذاكرة، برمجة، AI… مش هتلاقي خناقة بين المواضيع.'),

  -- About section
  ('about_eyebrow', 'عن المجتمع'),
  ('about_title', 'إحنا مين؟ <br/> ولِيه <span class="gradient-text">ByteEgypt</span>؟'),
  ('about_p1', '<strong>ByteEgypt | بايت مصر</strong> مبادرة طلابية مستقلة، اتعملت بإيد طلاب زيك بالظبط، عشان نجمع <strong>طلاب كليات الحاسبات والمعلومات والذكاء الاصطناعي</strong> في مصر — حكومي، خاص، وأهلي — تحت مجتمع واحد منظم واحترافي.'),
  ('about_p2', 'مجتمعنا <strong>لسه بادئ</strong> — وده فرصتك إنك تكون من أول الأعضاء اللي بيشكّلوا هوية المكان ده ويبنوا فيه علاقات قوية مع زمايلهم في نفس المجال.'),
  ('about_check_1', 'مجتمع <strong>مغلق</strong> لطلاب الحاسبات بس — مفيش رغي ولا مشتتات.'),
  ('about_check_2', '<strong>قنوات لكل تخصص</strong> (Web, AI, Cyber, Mobile...).'),
  ('about_check_3', '<strong>فريق إدارة نشط</strong> + بوتات حماية على مدار اليوم.'),
  ('about_check_4', '<strong>علاقات حقيقية</strong> مع زمايلك في نفس المجال.'),
  ('about_check_5', '<strong>مذاكرة جماعية</strong> صوتية وغرف هادية للكونسنتريشن.'),

  -- Features section
  ('features_eyebrow', 'مميزات المجتمع'),
  ('features_title', 'إيه اللي هتلاقيه دلوقتي في <span class="gradient-text">ByteEgypt</span>؟'),
  ('features_sub', 'دي المميزات الموجودة حالياً — والمجتمع هيكبر معاك مع الوقت.'),

  -- Roles section
  ('roles_eyebrow', 'هيكل الرتب'),
  ('roles_title', 'رتب <span class="gradient-text">منظمة</span> لكل عضو'),
  ('roles_sub', 'لما تنضم، هتختار رتبك حسب سنتك وتخصصك — وكل رتبة بتفتحلك قنوات معينة.'),

  -- Future section
  ('future_eyebrow', 'رؤيتنا للمستقبل'),
  ('future_title', 'قريباً في <span class="gradient-text">ByteEgypt</span>'),
  ('future_sub', 'المجتمع لسه بادئ — وده اللي بنخطط نضيفه قريباً مع نمو الكومينتي.'),
  ('future_note', 'دي رؤيتنا اللي بنشتغل عليها. كل ما المجتمع يكبر ونتعرف على بعض، كل ما الفرص دي تتحقق أسرع. <strong>كن جزء من البداية!</strong>'),

  -- Safety section
  ('safety_eyebrow', 'الأمان والحماية'),
  ('safety_title', 'مجتمع <span class="gradient-text">آمن</span> وموثوق'),
  ('safety_desc', 'بنخد الأمان جدّ. المجتمع فيه AutoMod مفعّل بكلمات ممنوعة، حماية من السبام، ونظام تذاكر للتحقق — عشان نضمن إن الكومينتي نضيف وآمن للكل.'),

  -- Join section
  ('join_eyebrow', 'طريقة الانضمام'),
  ('join_title', 'انضم في <span class="gradient-text">4 خطوات</span> سهلة'),
  ('join_sub', 'العملية كلها مش هتاخد منك دقيقتين — وكل حاجة مجانية.'),
  ('join_cta', 'يلا انضم دلوقتي'),
  ('join_note', 'الانضمام مجاني • مفيش إعلانات مزعجة • مجتمع خاص بطلاب الحاسبات'),

  -- FAQ
  ('faq_eyebrow', 'الأسئلة الشائعة'),
  ('faq_title', 'سؤال على بالك؟ <span class="gradient-text">هنا الإجابة</span>'),

  -- Final CTA
  ('cta_title', 'جاهز تكون جزء من <span class="gradient-text">ByteEgypt</span>؟'),
  ('cta_desc', 'انضم لمجتمع طلاب الحاسبات في مصر، وكن من أول الأعضاء اللي بيشكّلوا المستقبل.'),
  ('cta_button', 'انضم للمجتمع دلوقتي'),

  -- Footer
  ('footer_brand_title', 'ByteEgypt | بايت مصر'),
  ('footer_brand_desc', 'مجتمع طلاب الحاسبات في مصر — مبادرة طلابية غير ربحية'),
  ('footer_copyright', '© 2026 ByteEgypt. مبادرة طلابية مستقلة • Made with ♥ in Egypt 🇪🇬'),
  ('signature', 'egybyte by Yousef Khames');

-- ============ Features ============
INSERT INTO features (icon, gradient, title, description, sort_order) VALUES
  ('fa-solid fa-code', 'linear-gradient(135deg,#6366f1,#8b5cf6)', 'قنوات برمجة', 'قنوات للنقاش العام في البرمجة وحل المشاكل التقنية، تسأل وتلاقي زمايلك بيساعدوك.', 1),
  ('fa-solid fa-graduation-cap', 'linear-gradient(135deg,#10b981,#22d3ee)', 'قنوات أكاديمية', 'مذاكرة، موارد، كورسات، ومشاريع تخرج — كل اللي بيخص دراستك في الكلية.', 2),
  ('fa-solid fa-microphone', 'linear-gradient(135deg,#f59e0b,#ef4444)', 'غرف صوت ومذاكرة', 'غرفة "مذاكرة صامتة" تشتغل فيها مع زمايلك بدون كلام، وغرف صوتية للنقاش.', 3),
  ('fa-solid fa-people-group', 'linear-gradient(135deg,#ec4899,#8b5cf6)', 'مجتمع مغلق', 'مجتمع خاص بطلاب الحاسبات بس — بنبني علاقات حقيقية بعيد عن مشتتات السوشيال ميديا.', 4),
  ('fa-solid fa-microchip', 'linear-gradient(135deg,#06b6d4,#3b82f6)', 'تخصصات تقنية', 'اختار تخصصك المفضل (Web, AI, Cyber, Mobile, UI/UX) وتابع كل ما يخصه.', 5),
  ('fa-solid fa-book-open', 'linear-gradient(135deg,#84cc16,#10b981)', 'مكتبة موارد', 'كورسات، كتب، أدوات، روابط مفيدة — كله متجمع في قناة الموارد.', 6),
  ('fa-solid fa-shield-halved', 'linear-gradient(135deg,#a855f7,#ec4899)', 'مجتمع آمن ومحمي', 'AutoMod مفعّل، نظام تذاكر للتحقق، وفريق إدارة بيراقب — مفيش سبام ولا أذى.', 7),
  ('fa-solid fa-comments', 'linear-gradient(135deg,#0ea5e9,#6366f1)', 'نقاشات تقنية', 'نقاشات حول آخر التقنيات والأدوات، تبادل خبرات بين الطلاب والخريجين.', 8),
  ('fa-solid fa-lightbulb', 'linear-gradient(135deg,#fbbf24,#f59e0b)', 'قنوات سنوات دراسية', 'اختار سنتك (أولى → خريج) وكل سنة ليها قنواتها الخاصة وفرصها الخاصة.', 9);

-- ============ Future cards ============
INSERT INTO future_cards (icon, title, description, sort_order) VALUES
  ('fa-solid fa-briefcase', 'إعلانات وظائف وتدريبات', 'قريباً هنضم شركات تقنية لنشر فرص شغل وتدريب صيفي حقيقية للطلاب والخريجين.', 1),
  ('fa-solid fa-chalkboard-user', 'كورسات من ناس متخصصة', 'هنوفر كورسات حصرية للأعضاء من مدرّبين ومحترفين في كل تخصص تقني.', 2),
  ('fa-solid fa-university', 'قنوات لكل جامعة', 'قنوات خاصة لكل كلية حاسبات في مصر — عشان تتواصل مع زمايلك القرّب من نفس الكلية.', 3),
  ('fa-solid fa-trophy', 'مسابقات وهاكاثونات', 'مسابقات برمجة شهرية وهاكاثونات بجوايز — تنافس وتطور مهاراتك مع زمايلك.', 4),
  ('fa-solid fa-handshake', 'شراكات مع شركات تقنية', 'شراكات مع شركات تقنية مصرية وعربية لتوفير فرص وتجارب تعليمية للأعضاء.', 5),
  ('fa-solid fa-microphone-lines', 'ندوات وورش', 'ندوات أونلاين مع متخصصين، ورش عملية، وجلسات Q&A مع مهندسين شغّالين في السوق.', 6);

-- ============ Steps ============
INSERT INTO steps (step_num, icon, title, description, sort_order) VALUES
  (1, 'fa-brands fa-discord', 'اضغط على زر "انضم"', 'هتفتحلك صفحة ديسكورد. لو معندكش حساب، اعمل حساب جديد مجاناً في 30 ثانية.', 1),
  (2, 'fa-solid fa-clipboard-check', 'اقرأ القواعد ووافق', 'هتشوف قواعد المجتمع — وافق عليها عشان تفتحلك باقي القنوات.', 2),
  (3, 'fa-solid fa-circle-check', 'اختار سنتك وتخصصك', 'المجتمع هيسألك أسئلة قصيرة عشان يديك الرتب والقنوات المناسبة لك.', 3),
  (4, 'fa-solid fa-rocket', 'وثّق حسابك وابدأ', 'اضغط على الإيموجي ✅ في قناة التسجيل، وهتتفتحلك كل قنوات المجتمع تلقائي.', 4);

-- ============ FAQs ============
INSERT INTO faqs (question, answer, sort_order) VALUES
  ('الانضمام مجاني فعلاً؟', 'أيوه، <strong>الانضمام للمجتمع مجاني تماماً</strong> ومفيش أي اشتراكات. بس لازم نوضح: المجتمع نفسه مبادرة طلابية غير ربحية، لكن مستقبلاً ممكن نوفر <strong>كورسات حصرية مدفوعة</strong> من مدرّبين ومتخصصين في كل مجال (Web, AI, Cyber...) — وده اختياري تماماً، الأساسيات والقنوات والمذاكرة والتفاعل مع زمايلك كله مجاني للأبد.', 1),
  ('أنا طالب في كلية مش حاسبات، أقدر أنضم؟', '<strong>لا، المجتمع مغلق وحصري لطلاب كليات الحاسبات والمعلومات والذكاء الاصطناعي فقط</strong> (حكومي، خاص، أهلي). ده عشان نحافظ على جودة النقاشات وخصوصية المجتمع. لو إنت طالب في كلية تانية، ممكن تتابعنا في المستقبل لو فتحنا أبواب أوسع.', 2),
  ('أنا في سنة أولى ولسه مبتدأ، المجتمع هيناسبني؟', 'طبعاً! في قسم كامل اسمه "أكاديمي" فيه قنوات للأسئلة الأكاديمية، موارد للمبتدئين، وقنوات مذاكرة. وهتلاقي زمايلك في نفس مستواك بالظبط — وفي طلاب أكبر منك يقدروا يساعدوك.', 3),
  ('أنا خريج، هل المجتمع يفيدني؟', 'أكيد! دلوقتي تقدر تساعد الطلاب وتشارك خبرتك في النقاشات التقنية. ومستقبلاً هنوفر قنوات مخصصة <strong>للوظائف وإعلانات الشركات</strong> + شراكات مع شركات تقنية — كله قريباً.', 4),
  ('إيه الفرق بينكم وبين جروبات الفيسبوك؟', 'ده <strong>مجتمع مغلق وخاص بينا كطلبة حاسبات بس</strong> — بنبني فيه علاقات حقيقية مع بعض، نستفيد، ونناقش مواضيع تقنية مفيدة فعلاً. جروبات الفيسبوك مفتوحة للجميع، فيها رغي ومشتتات وإعلانات وكل حاجة مخلوطة. هنا الكلام بيكون <strong>في صلب موضوعنا</strong> — حاسبات وبرمجة وتكنولوجيا.', 5),
  ('المجتمع لسه بادئ يعني إيه؟', 'يعني إحنا في أول الطريق! دلوقتي عندنا الأساسيات: قنوات تقنية، قنوات أكاديمية، غرف صوت، نظام رتب، وفريق إدارة نشط. ومع نمو المجتمع، هنضيف <strong>كورسات، وظائف، شراكات، مسابقات، وقنوات لكل جامعة</strong>. كن من أول الأعضاء عشان تكون جزء من بناء المكان ده من الصفر.', 6);

-- ============ Roles ============
INSERT INTO roles (group_name, label, color, sort_order) VALUES
  ('years', '🟢 السنة الأولى', '#A7F3D0', 1),
  ('years', '🔵 السنة الثانية', '#6EE7B7', 2),
  ('years', '🟠 السنة الثالثة', '#34D399', 3),
  ('years', '🔴 السنة الرابعة', '#10B981', 4),
  ('years', '📕 السنة الخامسة', '#059669', 5),
  ('years', '🎓 خريج', '#047857', 6),
  ('specializations', '💻 Software Dev', '#FDE047', 1),
  ('specializations', '🤖 AI / ML', '#FACC15', 2),
  ('specializations', '🔒 Cybersecurity', '#EAB308', 3),
  ('specializations', '📱 Mobile Dev', '#CA8A04', 4),
  ('specializations', '🎨 UI / UX', '#A16207', 5);

-- ============ Stats ============
INSERT INTO stats (icon, number, label, sort_order) VALUES
  ('fa-solid fa-rocket', '2026', 'سنة التأسيس', 1),
  ('fa-solid fa-hashtag', '15+', 'قنوات متنوعة', 2),
  ('fa-solid fa-laptop-code', '6', 'تخصصات تقنية', 3),
  ('fa-solid fa-infinity', '∞', 'فرص للنمو سوا', 4);

-- ============ Safety points ============
INSERT INTO safety_points (icon, text, sort_order) VALUES
  ('fa-solid fa-robot', 'AutoMod ضد السبام والشتايم', 1),
  ('fa-solid fa-ticket', 'نظام تذاكر للتحقق والدعم', 2),
  ('fa-solid fa-user-shield', 'فريق موديريشن نشط', 3),
  ('fa-solid fa-lock', '2FA إجباري على فريق الإدارة', 4),
  ('fa-solid fa-eye-slash', 'حماية خصوصيتك — مفيش Doxing', 5);

-- ============ Marquee items ============
INSERT INTO marquee_items (icon, label, sort_order) VALUES
  ('fa-brands fa-python', 'Python', 1),
  ('fa-brands fa-java', 'Java', 2),
  ('fa-brands fa-react', 'React', 3),
  ('fa-brands fa-node-js', 'Node.js', 4),
  ('fa-solid fa-robot', 'AI / ML', 5),
  ('fa-solid fa-shield-halved', 'Cybersecurity', 6),
  ('fa-solid fa-mobile-screen', 'Mobile Dev', 7),
  ('fa-solid fa-cloud', 'Cloud / DevOps', 8),
  ('fa-solid fa-database', 'Databases', 9),
  ('fa-solid fa-palette', 'UI / UX', 10);

-- ============ Default admin user ============
-- username: admin, password: admin123 (CHANGE AFTER FIRST LOGIN)
-- Hash is sha256 of 'admin123' with salt 'byteegypt-salt-2026'
INSERT OR IGNORE INTO admin_users (username, password_hash) VALUES
  ('admin', '263df1d32e7e43dbde745a1fbf15ece25660166e797b488f29e8aef3a0380a3b');
