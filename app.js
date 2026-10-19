
        const badgesMaster = [
            { id: 'first_step', title: 'First Step Journey', icon: 'fa-seedling', color: 'from-amber-400 to-orange-500', reqText: 'Hafal minimal 1 kata', check: (m, xp, cases) => m >= 1 },
            { id: 'vocab_50', title: 'Vocab Enthusiast', icon: 'fa-book-bookmark', color: 'from-pink-400 to-rose-500', reqText: 'Hafal 50 kosakata', check: (m, xp, cases) => m >= 50 },
            { id: 'vocab_200', title: 'Cambridge Scholar', icon: 'fa-graduation-cap', color: 'from-purple-500 to-indigo-600', reqText: 'Hafal 200 kosakata', check: (m, xp, cases) => m >= 200 },
            { id: 'xp_500', title: 'Dedicated Educator', icon: 'fa-star', color: 'from-yellow-400 to-amber-600', reqText: 'Kumpulkan 500 XP', check: (m, xp, cases) => xp >= 500 },
            { id: 'sen_expert', title: 'SEN Specialist', icon: 'fa-hands-holding-child', color: 'from-emerald-400 to-teal-600', reqText: 'Miliki 5+ Skenario ABK', check: (m, xp, cases) => cases.length >= 5 },
            { id: 'mastery_1000', title: 'Master Teacher C2', icon: 'fa-crown', color: 'from-rose-500 to-purple-600', reqText: 'Hafal 1000 kosakata', check: (m, xp, cases) => m >= 1000 }
        ];

        const behavioralMatrixData = [
            { id: 'bm1', cat: 'SENSORY', trigger: 'Kebisingan Ruang Kelas / Transisi Kegiatan', reaction: 'Menutupi telinga, menolak jalan, atau gelisah berlebihan.', action: 'Gunakan Noise-Cancelling Headphones & sediakan visual transition countdown.', pedagogyTerm: 'Sensory De-escalation & Environmental Accommodation' },
            { id: 'bm2', cat: 'EMOTIONAL', trigger: 'Kewalahan Saat Lembar Kerja Terlalu Banyak', reaction: 'Menangis, meremas kertas, atau menolak menulis.', action: 'Terapkan Task Chunking (potong tugas jadi 2-3 soal saja dulu) & abaikan respon emosi sementara.', pedagogyTerm: 'Executive Scaffolding & Co-regulation' },
            { id: 'bm3', cat: 'EXECUTIVE', trigger: 'Mudah Terdistraksi Dalam 5 Menit Pertama', reaction: 'Melamun, memainkan alat tulis, tidak memulai instruksi.', action: 'Berikan penunjuk visual berpotongan tinggi (pointer) & timer visual 5 menit.', pedagogyTerm: 'Prompting Sequence & Visual Anchor' },
            { id: 'bm4', cat: 'SOCIAL', trigger: 'Kerja Kelompok Bising / Konflik Giliran Bicara', reaction: 'Menjauh dari kelompok, diam membisu, atau frustrasi.', action: 'Berikan Role-Card spesifik (misal: penanggung jawab penanda kertas) & berikan kalimat pembuka (*sentence starters*).', pedagogyTerm: 'Structured Peer Collaboration & Social Scripting' }
        ];

        const initialSenCases = [
            { id: 1, title: "Sensory Overload During Class Transition", topic: "Autism / Sensory Needs", scenario: "Murid merasa cemas, menutupi telinga, dan menolak berpindah dari ruang kelas ke perpustakaan karena suasana bising.", strategy: "Use visual schedule countdowns, offer noise-cancelling headphones, and prepare a designated quiet corridor transition.", keyTerms: ["Sensory Overload", "Visual Schedule", "Transitioning"] },
            { id: 2, title: "Difficulty Focusing on Long Reading Tasks", topic: "ADHD / Executive Functioning", scenario: "Siswa mudah terdistraksi dan tidak bisa menyelesaikan lembar bacaan panjang lebih dari 5 menit.", strategy: "Break the reading task into smaller chunks using a timer and implement high-contrast visual pointers.", keyTerms: ["Task Chunking", "Executive Functioning", "Visual Anchor"] },
            { id: 3, title: "Emotional Meltdown During Group Work", topic: "Emotional Regulation", scenario: "Anak merasa kewalahan saat kerja kelompok dan tiba-tiba menangis atau diam membisu.", strategy: "Apply co-regulation: approach with a low, calm voice, validate feelings, and transition to a sensory calm corner.", keyTerms: ["Co-regulation", "Calm Corner", "Validation"] },
            { id: 4, title: "Frustration in Fine Motor Writing Tasks", topic: "Dysgraphia / Fine Motor Support", scenario: "Murid mengalami kesulitan menulis tangan secara rapi dan cepat lelah saat menyalin instruksi.", strategy: "Provide adaptive pencil grips, offer speech-to-text options, or allow modified fill-in-the-blank worksheets.", keyTerms: ["Accommodation", "Adaptive Tools", "Differentiation"] }
        ];

        let senCasesList = [...initialSenCases];
        let historyLogs = [];
        let currentDictationItem = null;
        let lastGeneratedIEPText = "";
        let srsQueue = [];
        let srsCurrentIndex = 0;

        const baseVocabBank = [
            { word: "Classroom", level: "A2", meaning: "Ruang kelas tempat belajar mengajar", phonetic: "/ˈklɑːs.ruːm/", context: "The classroom is equipped with interactive tools.", category: "General" },
            { word: "Whiteboard", level: "A2", meaning: "Papan tulis putih", phonetic: "/ˈwaɪt.bɔːd/", context: "Ms. Michelle wrote the agenda on the whiteboard.", category: "General" },
            { word: "Lesson Plan", level: "A2", meaning: "Rencana pelaksanaan pembelajaran", phonetic: "/ˈles.ən plæn/", context: "Preparing a clear lesson plan structures teaching.", category: "Pedagogy" },
            { word: "Assessment", level: "A2", meaning: "Penilaian atau evaluasi pembelajaran", phonetic: "/əˈses.mənt/", context: "Assessment helps track student learning progress.", category: "Pedagogy" },
            { word: "Instruction", level: "A2", meaning: "Petunjuk atau instruksi mengajar", phonetic: "/ɪnˈstrʌk.ʃən/", context: "Clear instructions make activities easier to follow.", category: "Pedagogy" },
            { word: "Curriculum", level: "B1", meaning: "Kurikulum atau rancangan mata pelajaran", phonetic: "/kəˈrɪk.jə.ləm/", context: "Sekolah Cikal implements a learner-centered curriculum.", category: "Pedagogy" },
            { word: "Accommodation", level: "B2", meaning: "Penyesuaian cara belajar tanpa merubah standar", phonetic: "/əˌkɒm.əˈdeɪ.ʃən/", context: "Extra time is a helpful accommodation during tests.", category: "SEN" },
            { word: "Individualised Education Plan", level: "B2", meaning: "Rencana Pendidikan Individual (IEP) untuk siswa ABK", phonetic: "/ˌɪn.dɪˈvɪdʒ.u.ə.laɪzd/", context: "We review each Individualised Education Plan every term.", category: "SEN" },
            { word: "Differentiation", level: "C1", meaning: "Penyesuaian pengajaran sesuai kebutuhan siswa", phonetic: "/ˌdɪf.ə.ren.ʃiˈeɪ.ʃən/", context: "Differentiation ensures every student can access goals.", category: "Pedagogy" },
            { word: "Metacognition", level: "C2", meaning: "Kesadaran & pemahaman tentang proses berpikir sendiri", phonetic: "/ˌmet.ə.kɒɡˈnɪʃ.ən/", context: "Encouraging metacognition helps SEN students self-reflect.", category: "Pedagogy" }
        ];

        const academicPrefixes = [
            { w: "Cognitive", m: "Terkait proses kognitif berpikir", l: "B2" },
            { w: "Systematic", m: "Secara terstruktur & sistematis", l: "B2" },
            { w: "Empirical", m: "Berdasarkan bukti pengamatan nyata", l: "C1" },
            { w: "Comprehensive", m: "Menyeluruh dan luas mencakup semua", l: "C1" },
            { w: "Analytical", m: "Menggunakan pemikiran analisis mendalam", l: "B2" }
        ];

        const academicNouns = [
            { w: "Approach", m: "Pendekatan atau strategi metode", l: "B1" },
            { w: "Framework", m: "Kerangka kerja konseptual dasar", l: "B2" },
            { w: "Competency", m: "Keahlian atau kompetensi kemampuan", l: "B2" },
            { w: "Methodology", m: "Metodologi langkah-langkah pengajaran", l: "C1" }
        ];

        let vocabList = [];
        (function generate1000List() {
            let id = 1;
            baseVocabBank.forEach(item => {
                vocabList.push({ ...item, id: id++, mastered: false, srsBox: 1 });
            });

            let pIdx = 0, nIdx = 0;
            while (vocabList.length < 1000) {
                const pref = academicPrefixes[pIdx % academicPrefixes.length];
                const noun = academicNouns[nIdx % academicNouns.length];
                const combinedWord = `${pref.w} ${noun.w}`;
                const combinedMeaning = `${pref.m} dalam ${noun.m.toLowerCase()}`;
                const level = pref.l === 'C2' || noun.l === 'C2' ? 'C2' : (pref.l === 'C1' || noun.l === 'C1' ? 'C1' : 'B2');

                vocabList.push({
                    id: id++,
                    word: combinedWord,
                    level: level,
                    meaning: combinedMeaning,
                    phonetic: `/${pref.w.toLowerCase()} ${noun.w.toLowerCase()}/`,
                    context: `Applying a ${combinedWord.toLowerCase()} enhances teaching effectiveness at Cikal.`,
                    category: "Pedagogy",
                    mastered: false,
                    srsBox: 1
                });
                pIdx++;
                if (pIdx % academicPrefixes.length === 0) nIdx++;
            }
        })();

        let filteredCards = [];
        let currentCardIndex = 0;
        let userXP = 0;
        let isAutoplayActive = false;
        let autoplayIndex = 0;
        let autoplayTimeout = null;
        let dailyGoalTarget = 10;
        let isCardAutoAudioEnabled = false;

        window.addEventListener('DOMContentLoaded', () => {
            loadDarkMode();
            loadData();
            checkAuth();
            renderStats();
            renderHeatmap();
            filterFlashcards();
            renderSenCases();
            renderMatrixCards();
            renderBadges();
            renderHistoryLogs();
            renderDictionary();
            renderEmailTemplates();
            renderSrsView();
            renderTestCefrHome();
            loadTeacherNote();
            renderNoteVocabChips();
            initCikalCalendarWidget();
            loadLoveNote();
            initDictationGame();
            loadCertificateSettings();
            renderAdminDashboard();
            renderAdminNotices();
            renderUserNotices();
            switchTab(getCurrentRole() === 'admin' ? 'adminDashboard' : 'home');
        });

        function toggleMobileSidebar() {
            const sidebar = document.getElementById('sidebarNav');
            const backdrop = document.getElementById('mobileSidebarBackdrop');
            sidebar.classList.toggle('-translate-x-full');
            if (backdrop) backdrop.hidden = sidebar.classList.contains('-translate-x-full');
        }

        function switchTab(tab) {
            if (isAutoplayActive && tab !== 'autoplay') stopAutoplay();
            if (tab.startsWith('admin') && getCurrentRole() !== 'admin') return;
            
            ['home', 'learn', 'iepgen', 'matrix', 'sencases', 'dictation', 'badges', 'srs', 'autoplay', 'notes', 'dict', 'templates', 'history', 'testcefr', 'quiz', 'adminDashboard', 'adminNotices', 'adminCertificates'].forEach(t => {
                const sec = document.getElementById(`tab-${t}`);
                const btn = document.getElementById(`tabBtn-${t}`);
                if (sec) sec.classList.add('hidden');
                if (btn) btn.classList.remove('nav-btn-active');
            });

            const targetSec = document.getElementById(`tab-${tab}`);
            const targetBtn = document.getElementById(`tabBtn-${tab}`);
            
            if (targetSec) targetSec.classList.remove('hidden');
            if (targetBtn) targetBtn.classList.add('nav-btn-active');

            if (window.innerWidth < 1024) {
                const sidebar = document.getElementById('sidebarNav');
                if (sidebar) sidebar.classList.add('-translate-x-full');
                const backdrop = document.getElementById('mobileSidebarBackdrop');
                if (backdrop) backdrop.hidden = true;
            }
        }

        function toggleDarkMode() {
            const html = document.documentElement;
            const icon = document.getElementById('darkModeIcon');
            const text = document.getElementById('darkModeText');

            if (html.classList.contains('dark')) {
                html.classList.remove('dark');
                localStorage.setItem('michelle_theme', 'light');
                if (icon) icon.className = 'fa-solid fa-moon';
                if (text) text.innerText = 'Night';
            } else {
                html.classList.add('dark');
                localStorage.setItem('michelle_theme', 'dark');
                if (icon) icon.className = 'fa-solid fa-sun';
                if (text) text.innerText = 'Day';
            }
        }

        function loadDarkMode() {
            const saved = localStorage.getItem('michelle_theme');
            const icon = document.getElementById('darkModeIcon');
            const text = document.getElementById('darkModeText');
            if (saved === 'dark') {
                document.documentElement.classList.add('dark');
                if (icon) icon.className = 'fa-solid fa-sun';
                if (text) text.innerText = 'Day';
            }
        }

        function loadData() {
            const saved = localStorage.getItem('michelle_vocab_data_v12');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (parsed.length >= 1000) vocabList = parsed;
                } catch(e) {}
            }

            const savedCases = localStorage.getItem('michelle_sen_cases');
            if (savedCases) {
                try {
                    const parsedCases = JSON.parse(savedCases);
                    if (parsedCases.length > 0) senCasesList = parsedCases;
                } catch(e) {}
            }

            const savedHistory = localStorage.getItem('michelle_history_logs');
            if (savedHistory) {
                try { historyLogs = JSON.parse(savedHistory); } catch(e) {}
            }

            const savedXP = localStorage.getItem('michelle_xp');
            if (savedXP) userXP = parseInt(savedXP);

            const savedTarget = localStorage.getItem('michelle_daily_goal');
            if (savedTarget) {
                dailyGoalTarget = parseInt(savedTarget);
                const sel = document.getElementById('dailyGoalSelect');
                if (sel) sel.value = dailyGoalTarget;
            }
        }

        function saveData() {
            localStorage.setItem('michelle_vocab_data_v12', JSON.stringify(vocabList));
            localStorage.setItem('michelle_sen_cases', JSON.stringify(senCasesList));
            localStorage.setItem('michelle_history_logs', JSON.stringify(historyLogs));
            localStorage.setItem('michelle_xp', userXP);
            renderBadges();
        }

        function toggleCardAutoAudio() {
            isCardAutoAudioEnabled = !isCardAutoAudioEnabled;
            const btnText = document.getElementById('cardAutoAudioText');
            const icon = document.getElementById('cardAutoAudioIcon');

            if (isCardAutoAudioEnabled) {
                btnText.innerText = "ON";
                icon.className = "fa-solid fa-volume-high text-pink-500";
                if (filteredCards.length > 0) speakWord(filteredCards[currentCardIndex].word);
            } else {
                btnText.innerText = "OFF";
                icon.className = "fa-solid fa-volume-xmark text-slate-400";
            }
        }

        function filterFlashcards() {
            const lvl = document.getElementById('levelFilter').value;
            if (lvl === 'ALL') filteredCards = [...vocabList];
            else filteredCards = vocabList.filter(v => v.level === lvl);
            currentCardIndex = 0;
            renderCurrentCard();
        }

        function renderCurrentCard() {
            const container = document.getElementById('flashcardContainer');
            if (filteredCards.length === 0) {
                container.innerHTML = `<div class="text-center text-xs text-pink-400 dark:text-purple-300 p-8 glass-card rounded-3xl">Belum ada kosakata di level ini. Silakan klik <b>+ Tambah Kata</b> di sidebar!</div>`;
                return;
            }

            const card = filteredCards[currentCardIndex];
            container.innerHTML = `
                <div id="flashcardObj" class="flashcard w-full max-w-md h-80 cursor-pointer" onclick="this.classList.toggle('flipped')">
                    <div class="flashcard-inner relative w-full h-full duration-500">
                        <div class="flashcard-front absolute inset-0 glass-card rounded-3xl p-6 flex flex-col justify-between border-2 border-pink-200 dark:border-purple-800 text-center shadow-lg">
                            <div class="flex justify-between items-center text-xs">
                                <span class="px-2.5 py-1 rounded-full bg-pink-100 dark:bg-purple-900/60 text-pink-700 dark:text-purple-200 font-extrabold uppercase">${card.level}</span>
                                <span class="text-pink-400 dark:text-purple-300 font-medium">${card.category}</span>
                            </div>
                            <div>
                                <h2 class="font-serif text-3xl font-extrabold text-pink-800 dark:text-purple-100">${card.word}</h2>
                                <p class="text-xs text-slate-400 dark:text-purple-300/60 mt-1">${card.phonetic}</p>
                                <button onclick="event.stopPropagation(); speakWord('${card.word.replace(/'/g, "\\'")}')" class="mt-3 w-10 h-10 rounded-full bg-pink-100 dark:bg-purple-900/60 text-pink-600 dark:text-purple-200 inline-flex items-center justify-center hover:bg-pink-200 transition-all shadow-sm">
                                    <i class="fa-solid fa-volume-high"></i>
                                </button>
                            </div>
                            <p class="text-[11px] text-pink-400 dark:text-purple-300 font-medium">Klik kartu untuk melihat arti <i class="fa-solid fa-rotate ml-1"></i></p>
                        </div>
                        <div class="flashcard-back absolute inset-0 glass-card rounded-3xl p-6 flex flex-col justify-between border-2 border-purple-200 dark:border-purple-700 text-center shadow-lg bg-purple-50/30 dark:bg-purple-950/40">
                            <div class="flex justify-between items-center text-xs">
                                <span class="px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-200 font-extrabold uppercase">${card.level}</span>
                                <span class="text-xs text-slate-400 dark:text-purple-300/60">${currentCardIndex + 1} / ${filteredCards.length}</span>
                            </div>
                            <div>
                                <h3 class="text-lg font-bold text-purple-800 dark:text-purple-200 mb-2">${card.meaning}</h3>
                                <div class="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-purple-100 dark:border-purple-800 text-left">
                                    <p class="text-xs text-slate-600 dark:text-purple-200 italic">"${card.context}"</p>
                                </div>
                            </div>
                            <p class="text-[11px] text-purple-400 dark:text-purple-300 font-medium">Klik untuk balikkan kartu</p>
                        </div>
                    </div>
                </div>
            `;
            updateMasteredButtonState();
            
            const feedbackBox = document.getElementById('speechFeedbackBox');
            if (feedbackBox) feedbackBox.classList.add('hidden');

            if (isCardAutoAudioEnabled) {
                speakWord(card.word);
            }
        }

        function speakWord(word) {
            const utterance = new SpeechSynthesisUtterance(word);
            const accent = document.getElementById('cardVoiceAccent') ? document.getElementById('cardVoiceAccent').value : 'en-GB';
            const speed = document.getElementById('cardVoiceSpeed') ? parseFloat(document.getElementById('cardVoiceSpeed').value) : 1.0;

            utterance.lang = accent;
            utterance.rate = speed;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        }

        function testPronunciation() {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                alert('Browser kamu belum mendukung Speech Recognition. Silakan gunakan Google Chrome.');
                return;
            }

            const recognition = new SpeechRecognition();
            recognition.lang = document.getElementById('cardVoiceAccent') ? document.getElementById('cardVoiceAccent').value : 'en-GB';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            const box = document.getElementById('speechFeedbackBox');
            const status = document.getElementById('speechFeedbackStatus');

            box.classList.remove('hidden');
            status.className = "text-purple-600 dark:text-purple-300 font-bold";
            status.innerHTML = `<i class="fa-solid fa-microphone text-pink-500 animate-pulse mr-1"></i> Mendengarkan... Ucapkan kata di atas!`;

            recognition.start();

            recognition.onresult = (event) => {
                const spokenWord = event.results[0][0].transcript.toLowerCase().trim();
                const targetWord = filteredCards[currentCardIndex].word.toLowerCase().trim();

                if (spokenWord === targetWord || spokenWord.includes(targetWord) || targetWord.includes(spokenWord)) {
                    status.className = "text-emerald-600 dark:text-emerald-400 font-extrabold text-sm";
                    status.innerHTML = `🎉 Luar biasa! Pelafalan "${spokenWord}" kamu sangat tepat! <br><span class="text-xs font-bold text-amber-500">+15 XP Reward! ⭐</span>`;
                    addXP(15);
                    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
                } else {
                    status.className = "text-rose-500 dark:text-rose-400 font-bold text-xs";
                    status.innerHTML = `❌ Kamu mengucapkan: <span class="underline">"${spokenWord}"</span>.<br>Target: "${filteredCards[currentCardIndex].word}". Coba klik Tes Pelafalan lagi! 💪`;
                }
            };

            recognition.onerror = () => {
                status.className = "text-amber-600 dark:text-amber-400 font-bold text-xs";
                status.innerHTML = `<i class="fa-solid fa-triangle-exclamation mr-1"></i> Tidak terdengar suara/mikrofon belum diizinkan. Coba klik lagi yaa!`;
            };
        }

        function prevCard() {
            if (filteredCards.length === 0) return;
            currentCardIndex = (currentCardIndex - 1 + filteredCards.length) % filteredCards.length;
            renderCurrentCard();
        }

        function nextCard() {
            if (filteredCards.length === 0) return;
            currentCardIndex = (currentCardIndex + 1) % filteredCards.length;
            renderCurrentCard();
        }

        function toggleMasteredCurrent() {
            if (filteredCards.length === 0) return;
            const card = filteredCards[currentCardIndex];
            const target = vocabList.find(v => v.id === card.id);
            if (target) {
                target.mastered = !target.mastered;
                if (target.mastered) {
                    target.srsBox = Math.min(5, (target.srsBox || 1) + 1);
                    addXP(10);
                    confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
                }
                saveData();
                renderStats();
                updateMasteredButtonState();
                renderSrsView();
            }
        }

        function updateMasteredButtonState() {
            if (filteredCards.length === 0) return;
            const card = filteredCards[currentCardIndex];
            const btn = document.getElementById('masteredBtn');
            if (card.mastered) {
                btn.className = "px-5 py-3 rounded-full text-xs font-bold border-2 border-emerald-500 text-white bg-emerald-500 transition-all flex items-center gap-2 shadow-sm";
                btn.innerHTML = `<i class="fa-solid fa-circle-check text-base"></i> Sudah Dihafal`;
            } else {
                btn.className = "px-5 py-3 rounded-full text-xs font-bold border-2 border-pink-400 dark:border-purple-500 text-pink-600 dark:text-purple-200 bg-white dark:bg-slate-900 hover:bg-pink-50 transition-all flex items-center gap-2 shadow-sm";
                btn.innerHTML = `<i class="fa-regular fa-circle-check text-base"></i> Tandai Dihafal`;
            }
        }

        function renderSenCases() {
            const container = document.getElementById('senCasesContainer');
            if (!container) return;
            container.innerHTML = '';

            const searchKey = document.getElementById('caseSearchInput') ? document.getElementById('caseSearchInput').value.toLowerCase() : '';
            const selectedTopic = document.getElementById('caseFilterTopic') ? document.getElementById('caseFilterTopic').value : 'ALL';

            const filteredCases = senCasesList.filter(c => {
                const matchSearch = c.title.toLowerCase().includes(searchKey) || 
                                    c.scenario.toLowerCase().includes(searchKey) || 
                                    c.strategy.toLowerCase().includes(searchKey);
                const matchTopic = (selectedTopic === 'ALL') || (c.topic === selectedTopic);
                return matchSearch && matchTopic;
            });

            if (filteredCases.length === 0) {
                container.innerHTML = `<div class="col-span-2 text-center text-xs text-slate-400 dark:text-purple-300/60 p-8 glass-card rounded-3xl">Tidak ada skenario kasus yang cocok dengan kriteria pencarian.</div>`;
                return;
            }

            filteredCases.forEach(item => {
                const card = document.createElement('div');
                card.className = "p-5 rounded-3xl glass-card border border-pink-200 dark:border-purple-800 space-y-3 flex flex-col justify-between hover:shadow-lg transition-all";
                card.innerHTML = `
                    <div class="space-y-2">
                        <div class="flex justify-between items-center text-xs">
                            <span class="px-2.5 py-1 rounded-full bg-pink-100 dark:bg-purple-900/60 text-pink-700 dark:text-purple-200 font-extrabold uppercase">${item.topic}</span>
                            <span class="text-slate-400 dark:text-purple-300/60 font-semibold">Case #${item.id}</span>
                        </div>
                        <h4 class="font-serif font-bold text-base text-pink-900 dark:text-purple-100">${item.title}</h4>
                        <div class="p-3 rounded-2xl bg-rose-50/60 dark:bg-purple-900/30 border border-rose-100 dark:border-purple-800 text-xs text-slate-700 dark:text-purple-200 leading-relaxed">
                            <span class="font-bold text-pink-600 dark:text-purple-300 block mb-0.5">Skenario Lapangan:</span>
                            "${item.scenario}"
                        </div>
                        <div class="p-3 rounded-2xl bg-purple-50/60 dark:bg-purple-900/40 border border-purple-100 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 leading-relaxed">
                            <span class="font-bold text-purple-700 dark:text-purple-300 block mb-0.5">Strategi Pendampingan Guru (English):</span>
                            "${item.strategy}"
                        </div>
                    </div>
                    <div class="pt-2 border-t border-pink-100 dark:border-purple-800/40 flex items-center justify-between">
                        <div class="flex flex-wrap gap-1">
                            ${(item.keyTerms || []).map(t => `<span class="text-[9px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-pink-600 dark:text-purple-300 border border-pink-200 dark:border-purple-800">+ ${t}</span>`).join('')}
                        </div>
                        <button onclick="speakWord('${item.strategy.replace(/'/g, "\\'")}')" class="text-xs bg-pink-100 dark:bg-purple-900/60 text-pink-700 dark:text-purple-200 font-bold px-3 py-1.5 rounded-xl hover:bg-pink-200 transition-all flex items-center gap-1">
                            <i class="fa-solid fa-volume-high text-pink-500 dark:text-purple-300"></i> Dengarkan
                        </button>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        function toggleAutoplay() {
            if (isAutoplayActive) stopAutoplay();
            else startAutoplay();
        }

        function startAutoplay() {
            isAutoplayActive = true;
            const btn = document.getElementById('autoPlayBtn');
            const pulse = document.getElementById('audioWavePulse');

            btn.innerHTML = `<i class="fa-solid fa-pause"></i> Pause Autoplay`;
            btn.className = "w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-lg text-xs flex items-center justify-center gap-2";
            
            if (pulse) pulse.classList.remove('opacity-0');
            autoplayIndex = 0;
            playNextAutoplayItem();
        }

        function stopAutoplay() {
            isAutoplayActive = false;
            if (autoplayTimeout) clearTimeout(autoplayTimeout);
            window.speechSynthesis.cancel();

            const btn = document.getElementById('autoPlayBtn');
            const pulse = document.getElementById('audioWavePulse');

            if (btn) {
                btn.innerHTML = `<i class="fa-solid fa-play"></i> Mulai Autoplay`;
                btn.className = "w-full py-3.5 pink-gradient-btn text-white font-bold rounded-2xl shadow-lg text-xs flex items-center justify-center gap-2";
            }
            if (pulse) pulse.classList.add('opacity-0');
        }

        function playNextAutoplayItem() {
            if (!isAutoplayActive || vocabList.length === 0) return;

            const item = vocabList[autoplayIndex % vocabList.length];
            document.getElementById('autoLevelBadge').innerText = `Level ${item.level}`;
            document.getElementById('autoIndexTracker').innerText = `Word ${autoplayIndex + 1} / ${vocabList.length}`;
            document.getElementById('autoWordDisplay').innerText = item.word;
            document.getElementById('autoMeaningDisplay').innerText = item.meaning;
            document.getElementById('autoContextDisplay').innerText = `"${item.context}"`;

            const speed = parseFloat(document.getElementById('autoSpeedSelect').value) || 1.0;
            const accent = document.getElementById('autoVoiceAccent') ? document.getElementById('autoVoiceAccent').value : 'en-GB';

            const uttWord = new SpeechSynthesisUtterance(item.word);
            uttWord.lang = accent;
            uttWord.rate = speed;

            const uttContext = new SpeechSynthesisUtterance(item.context);
            uttContext.lang = accent;
            uttContext.rate = speed;

            window.speechSynthesis.speak(uttWord);

            uttWord.onend = () => {
                if (!isAutoplayActive) return;
                autoplayTimeout = setTimeout(() => {
                    if (!isAutoplayActive) return;
                    window.speechSynthesis.speak(uttContext);
                    uttContext.onend = () => {
                        if (!isAutoplayActive) return;
                        autoplayTimeout = setTimeout(() => {
                            autoplayIndex++;
                            playNextAutoplayItem();
                        }, 2500);
                    };
                }, 1000);
            };
        }

        const leitnerIntervals = { 1: "Review Setiap Hari", 2: "Review Tiap 3 Hari", 3: "Review Tiap 7 Hari", 4: "Review Tiap 14 Hari", 5: "Review Tiap 30 Hari (Mastered)" };

        function renderSrsView() {
            const container = document.getElementById('srsDashboardView');
            if (!container) return;
            container.innerHTML = '';

            const grid = document.createElement('div');
            grid.className = "grid grid-cols-2 md:grid-cols-5 gap-3 my-2";

            for (let b = 1; b <= 5; b++) {
                const count = vocabList.filter(v => (v.srsBox || 1) === b).length;
                const boxDiv = document.createElement('div');
                boxDiv.className = `p-4 rounded-2xl glass-card border ${b === 5 ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/30' : 'border-pink-200 dark:border-purple-800'} text-center space-y-1`;
                boxDiv.innerHTML = `
                    <div class="text-xs font-extrabold uppercase text-pink-700 dark:text-purple-200">Box ${b}</div>
                    <div class="text-3xl font-black text-pink-600 dark:text-purple-300 font-fredoka">${count}</div>
                    <div class="text-[9px] text-slate-500 dark:text-purple-300/60 font-semibold">${leitnerIntervals[b]}</div>
                `;
                grid.appendChild(boxDiv);
            }

            container.appendChild(grid);
        }

        function startSrsReviewSession() {
            srsQueue = vocabList.filter(v => (v.srsBox || 1) < 5).sort(() => 0.5 - Math.random()).slice(0, 5);
            if (srsQueue.length === 0) {
                alert("Luar biasa! Semua kosakata sudah berada di Box 5 (Sangat Dihafal)! 🎉");
                return;
            }
            srsCurrentIndex = 0;
            document.getElementById('srsReviewSessionArea').classList.remove('hidden');
            renderSrsCurrentCard();
        }

        function renderSrsCurrentCard() {
            if (srsCurrentIndex >= srsQueue.length) {
                document.getElementById('srsReviewSessionArea').classList.add('hidden');
                addXP(25);
                confetti({ particleCount: 80, spread: 70 });
                alert("Sesi Ulang SRS selesai! Kamu berhasil melatih daya ingat 5 kata! +25 XP Reward ⭐");
                renderSrsView();
                return;
            }

            const item = srsQueue[srsCurrentIndex];
            const cardObj = document.getElementById('srsInteractiveCard');
            if (cardObj) cardObj.classList.remove('flipped');

            document.getElementById('srsSessionProgress').innerText = `Sesi SRS ${srsCurrentIndex + 1} / ${srsQueue.length}`;
            document.getElementById('srsCurrentBoxBadge').innerText = `Box ${item.srsBox || 1}`;
            document.getElementById('srsCardLevel').innerText = `LEVEL ${item.level}`;
            document.getElementById('srsCardWord').innerText = item.word;
            document.getElementById('srsCardPhonetic').innerText = item.phonetic || '/.../';
            document.getElementById('srsCardMeaning').innerText = item.meaning;
            document.getElementById('srsCardContext').innerText = `"${item.context}"`;
        }

        function handleSrsAnswer(isRemembered) {
            const item = srsQueue[srsCurrentIndex];
            const target = vocabList.find(v => v.id === item.id);

            if (target) {
                if (isRemembered) {
                    target.srsBox = Math.min(5, (target.srsBox || 1) + 1);
                    if (target.srsBox === 5) target.mastered = true;
                    addXP(10);
                } else {
                    target.srsBox = 1;
                    target.mastered = false;
                }
                saveData();
                renderStats();
            }

            srsCurrentIndex++;
            renderSrsCurrentCard();
        }

        function renderMatrixCards() {
            const container = document.getElementById('matrixGridContainer');
            if (!container) return;
            container.innerHTML = '';

            const selectedCat = document.getElementById('matrixFilterCategory').value;
            const filtered = selectedCat === 'ALL' ? behavioralMatrixData : behavioralMatrixData.filter(b => b.cat === selectedCat);

            filtered.forEach(item => {
                const card = document.createElement('div');
                card.className = "p-5 rounded-3xl glass-card border border-pink-200 dark:border-purple-800 space-y-3 flex flex-col justify-between";
                card.innerHTML = `
                    <div class="space-y-2">
                        <div class="flex justify-between items-center text-xs">
                            <span class="px-2.5 py-1 rounded-full bg-pink-100 dark:bg-purple-900/60 text-pink-700 dark:text-purple-200 font-extrabold uppercase">${item.cat}</span>
                            <span class="text-slate-400 dark:text-purple-300/60 font-semibold">Matrix #${item.id}</span>
                        </div>
                        <h4 class="font-serif font-bold text-base text-pink-900 dark:text-purple-100">Pemicu: "${item.trigger}"</h4>
                        <div class="p-3 rounded-2xl bg-rose-50/60 dark:bg-purple-900/30 border border-rose-100 dark:border-purple-800 text-xs text-slate-700 dark:text-purple-200 leading-relaxed">
                            <span class="font-bold text-pink-600 dark:text-purple-300 block mb-0.5">Reaksi Murid:</span>
                            "${item.reaction}"
                        </div>
                        <div class="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                            <span class="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">Langkah Penanganan Instan (Action):</span>
                            "${item.action}"
                        </div>
                    </div>
                    <div class="pt-2 border-t border-pink-100 dark:border-purple-800/40 flex items-center justify-between">
                        <span class="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-200">
                            🎓 ${item.pedagogyTerm}
                        </span>
                        <button onclick="speakWord('${item.action.replace(/'/g, "\\'")}')" class="text-xs bg-pink-100 dark:bg-purple-900/60 text-pink-700 dark:text-purple-200 font-bold px-3 py-1.5 rounded-xl hover:bg-pink-200 transition-all flex items-center gap-1">
                            <i class="fa-solid fa-volume-high text-pink-500 dark:text-purple-300"></i> Dengarkan
                        </button>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        function generateIEPGoalDraft() {
            const domain = document.getElementById('iepDomainSelect').value;
            const challenge = document.getElementById('iepChallengeInput').value.trim() || "maintaining sustained attention during learning tasks";
            const prompting = document.getElementById('iepPromptSelect').value;

            let targetGoal = "";
            let accList = [];

            if (domain.includes("Executive Functioning")) {
                targetGoal = `By the end of the term, the student will engage in structured learning activities addressing '${challenge}' for 15-20 consecutive minutes ${prompting} in 4 out of 5 observed classroom sessions.`;
                accList = ["Utilize visual timers and task-chunking checklists.", "Provide movement breaks after completing mini-milestones.", "Use high-contrast visual anchors for task instructions."];
            } else if (domain.includes("Sensory")) {
                targetGoal = `By the end of the term, when experiencing sensory or emotional triggers related to '${challenge}', the student will independently utilize a designated calming strategy or request a sensory break ${prompting} in 80% of opportunities.`;
                accList = ["Provide access to noise-cancelling headphones and sensory calm space.", "Implement proactive co-regulation with low-arousal verbal tones.", "Offer visual emotion-rating charts to express internal states."];
            } else if (domain.includes("Communication")) {
                targetGoal = `By the end of the term, the student will initiate and sustain social/learning interactions during group work while managing '${challenge}' ${prompting} across 3 consecutive learning cycles.`;
                accList = ["Provide structured role-cards during collaborative tasks.", "Use social scripts and clear sentence starters for peer interaction.", "Acknowledge positive communicative attempts with specific praise."];
            } else {
                targetGoal = `By the end of the term, the student will complete differentiated academic reading/writing goals despite '${challenge}' ${prompting} in 4 out of 5 weekly formative evaluations.`;
                accList = ["Provide text-to-speech accommodations or simplified font formats.", "Allow alternative response modes (oral responses, fill-in-the-blank worksheets).", "Break multi-step instructions into clear 1-2 step visual bullet points."];
            }

            lastGeneratedIEPText = `IEP ANNUAL SMART GOAL:\n${targetGoal}\n\nRECOMMENDED CLASSROOM ACCOMMODATIONS:\n• ${accList.join('\n• ')}\n\nKEY PEDAGOGICAL PHRASES:\n• Structured Scaffolding & Differentiation\n• Co-regulation & Sensory Management\n• Formative Behavioral Observation`;

            const outputContainer = document.getElementById('iepOutputBox');
            outputContainer.innerHTML = `
                <div class="p-3 rounded-xl bg-pink-100/60 dark:bg-purple-950/60 border border-pink-200 dark:border-purple-800 font-bold text-pink-800 dark:text-purple-200">
                    🎯 Domain: ${domain}
                </div>
                <div>
                    <span class="font-extrabold text-purple-700 dark:text-purple-300 block mb-1">Draf SMART Goal (English):</span>
                    <p class="italic bg-white/70 dark:bg-slate-900/70 p-3 rounded-xl border border-pink-100 dark:border-purple-900 font-serif text-slate-800 dark:text-purple-100">"${targetGoal}"</p>
                </div>
                <div>
                    <span class="font-extrabold text-pink-700 dark:text-pink-300 block mb-1">Akomodasi Kelas Yang Direkomendasikan:</span>
                    <ul class="list-disc pl-5 space-y-1 text-slate-600 dark:text-purple-200">
                        ${accList.map(a => `<li>${a}</li>`).join('')}
                    </ul>
                </div>
            `;

            addXP(15);
            confetti({ particleCount: 40, spread: 50 });
        }

        function copyIEPResult() {
            if (!lastGeneratedIEPText) { alert("Belum ada draf IEP yang dibuat. Klik 'Buat Draf Indikator IEP' terlebih dahulu."); return; }
            navigator.clipboard.writeText(lastGeneratedIEPText);
            alert("Draf Indikator IEP berhasil disalin ke clipboard! ✨");
        }

        function sendIEPToNote() {
            if (!lastGeneratedIEPText) { alert("Belum ada draf IEP yang dibuat."); return; }
            const noteArea = document.getElementById('teacherNoteInput');
            noteArea.value += (noteArea.value ? '\n\n' : '') + lastGeneratedIEPText;
            autoSaveNote();
            switchTab('notes');
            alert("Draf IEP berhasil dimasukkan ke tab 'IEP Notes'! ✨");
        }

        function initDictationGame() {
            if (vocabList.length === 0) return;
            currentDictationItem = vocabList[Math.floor(Math.random() * vocabList.length)];
            const hint = document.getElementById('dictationHintDisplay');
            const input = document.getElementById('dictationAnswerInput');
            const fb = document.getElementById('dictationFeedback');

            if (hint) hint.innerText = `Arti: "${currentDictationItem.meaning}"`;
            if (input) input.value = '';
            if (fb) fb.classList.add('hidden');
        }

        function playDictationAudio() {
            if (!currentDictationItem) return;
            speakWord(currentDictationItem.word);
        }

        function checkDictationAnswer() {
            if (!currentDictationItem) return;
            const userAns = document.getElementById('dictationAnswerInput').value.trim().toLowerCase();
            const targetAns = currentDictationItem.word.toLowerCase();
            const fb = document.getElementById('dictationFeedback');

            fb.classList.remove('hidden');

            if (userAns === targetAns) {
                fb.className = "text-xs font-bold text-emerald-600 dark:text-emerald-400 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800";
                fb.innerHTML = `🎉 Benar sekali! Jawabannya adalah <b>"${currentDictationItem.word}"</b>. <br><span class="text-amber-500">+15 XP Reward!</span>`;
                addXP(15);
                confetti({ particleCount: 50, spread: 60 });
                setTimeout(initDictationGame, 2000);
            } else {
                fb.className = "text-xs font-bold text-rose-500 dark:text-rose-400 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800";
                fb.innerHTML = `❌ Hampir tepat! Kamu mengetik "${userAns}". Dengarkan lagi audionya yaa!`;
            }
        }

        function openCertificateModal() {
            applyCertificateSettings();
            const masteredCount = vocabList.filter(v => v.mastered).length;
            const now = new Date();
            const dateStr = now.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

            document.getElementById('certVocabCount').innerText = `${masteredCount} Kata`;
            document.getElementById('certXPCount').innerText = `⭐ ${userXP} XP`;
            document.getElementById('certDateStr').innerText = dateStr;

            document.getElementById('certificateModal').classList.remove('hidden');
        }

        function closeCertificateModal() { document.getElementById('certificateModal').classList.add('hidden'); }

        function printCertificate() { applyCertificateSettings(); window.print(); }

        function renderBadges() {
            const container = document.getElementById('badgesGrid');
            if (!container) return;
            container.innerHTML = '';

            const masteredCount = vocabList.filter(v => v.mastered).length;
            let unlockedCount = 0;

            badgesMaster.forEach(badge => {
                const isUnlocked = badge.check(masteredCount, userXP, senCasesList);
                if (isUnlocked) unlockedCount++;

                const card = document.createElement('div');
                card.className = `p-4 rounded-2xl glass-card border ${isUnlocked ? 'border-amber-300 dark:border-amber-600 bg-amber-50/20' : 'border-slate-200 dark:border-slate-800 opacity-60'} text-center space-y-2 relative overflow-hidden`;
                card.innerHTML = `
                    <div class="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr ${isUnlocked ? badge.color : 'from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800'} text-white flex items-center justify-center text-xl shadow-md">
                        <i class="fa-solid ${badge.icon}"></i>
                    </div>
                    <div>
                        <h4 class="font-serif font-bold text-xs ${isUnlocked ? 'text-pink-900 dark:text-purple-100' : 'text-slate-400'}">${badge.title}</h4>
                        <p class="text-[10px] text-slate-500 dark:text-purple-300/60 mt-0.5">${badge.reqText}</p>
                    </div>
                    <span class="text-[9px] font-extrabold px-2 py-0.5 rounded-full ${isUnlocked ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'} inline-block">
                        ${isUnlocked ? 'Unlocked 🌟' : 'Locked 🔒'}
                    </span>
                `;
                container.appendChild(card);
            });

            document.getElementById('unlockedBadgesCount').innerText = `${unlockedCount}/${badgesMaster.length}`;
        }

        function openResetModal() {
            const masteredCount = vocabList.filter(v => v.mastered).length;
            document.getElementById('resetPreviewMastered').innerText = `${masteredCount} Kata`;
            document.getElementById('resetPreviewXP').innerText = `⭐ ${userXP}`;
            document.getElementById('resetModal').classList.remove('hidden');
        }

        function closeResetModal() { document.getElementById('resetModal').classList.add('hidden'); }

        function confirmResetProgress() {
            const masteredCount = vocabList.filter(v => v.mastered).length;
            const now = new Date();
            const dateStr = now.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

            historyLogs.unshift({
                id: historyLogs.length + 1,
                date: dateStr,
                mastered: masteredCount,
                total: vocabList.length,
                xp: userXP
            });

            vocabList.forEach(v => {
                v.mastered = false;
                v.srsBox = 1;
            });
            userXP = 0;

            saveData();
            renderStats();
            filterFlashcards();
            renderDictionary();
            renderSrsView();
            renderHistoryLogs();
            closeResetModal();

            alert('Progres belajar berhasil di-reset ke awal! Capaian sebelumnya tersimpan rapi di menu "Arsip Belajar". Selamat belajar kembali, Michelle! ✨');
        }

        function renderHistoryLogs() {
            const container = document.getElementById('historyLogContainer');
            if (!container) return;
            container.innerHTML = '';

            if (historyLogs.length === 0) {
                container.innerHTML = `<div class="col-span-2 text-center text-xs text-slate-400 dark:text-purple-300/60 p-8 glass-card rounded-3xl">Belum ada arsip riwayat pembelajaran. Setelah melakukan Reset Progres, capaian pembelajaranmu akan muncul di sini!</div>`;
                return;
            }

            historyLogs.forEach(log => {
                const percent = ((log.mastered / log.total) * 100).toFixed(1);
                const card = document.createElement('div');
                card.className = "p-4 rounded-2xl glass-card border border-purple-200 dark:border-purple-800 space-y-2 text-xs";
                card.innerHTML = `
                    <div class="flex justify-between items-center text-pink-700 dark:text-purple-300 font-bold">
                        <span><i class="fa-solid fa-certificate mr-1 text-amber-500"></i> Sesi Belajar #${log.id}</span>
                        <span class="text-[10px] text-slate-400 dark:text-purple-300/60 font-medium">${log.date}</span>
                    </div>
                    <div class="grid grid-cols-3 gap-2 text-center pt-2">
                        <div class="p-2 rounded-xl bg-pink-50 dark:bg-purple-900/40">
                            <span class="text-[9px] text-slate-400 block">Dihafal</span>
                            <span class="font-bold text-pink-600 dark:text-pink-400 text-sm">${log.mastered} Kata</span>
                        </div>
                        <div class="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/40">
                            <span class="text-[9px] text-slate-400 block">Capaian</span>
                            <span class="font-bold text-purple-600 dark:text-purple-300 text-sm">${percent}%</span>
                        </div>
                        <div class="p-2 rounded-xl bg-rose-50 dark:bg-purple-900/40">
                            <span class="text-[9px] text-slate-400 block">XP</span>
                            <span class="font-bold text-rose-500 text-sm">⭐ ${log.xp}</span>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        function addXP(amount) {
            userXP += amount;
            saveData();
            renderStats();
        }

        const APP_PASSWORDS = { michelle: 'SEMANGATBELAJAR', admin: 'BAMBUAPUS123' };
        const DEFAULT_CERTIFICATE = {
            name: 'Ms. Michelle', title: 'Sertifikat Capaian Belajar',
            description: 'Atas dedikasi dan pencapaian luar biasa dalam menguasai kosakata Cambridge English, pedagogi pendampingan anak berkebutuhan khusus (SEN), dan penulisan laporan IEP profesional di Sekolah Cikal Serpong.',
            institution: 'Sekolah Cikal Serpong', signer: 'SEN Pedagogy Team'
        };
        function getCurrentRole() { return localStorage.getItem('michelle_app_role') || 'michelle'; }
        function updateLoginRole() {
            const role = document.getElementById('loginRole').value;
            const name = document.getElementById('loginName');
            const welcome = document.getElementById('loginWelcome');
            name.value = role === 'admin' ? 'Admin' : 'Michelle';
            name.readOnly = role === 'admin';
            welcome.innerText = role === 'admin' ? 'Welcome, Admin! 🔷' : 'Welcome, Michelle! 🌸';
            document.getElementById('loginOverlay').classList.toggle('admin-login', role === 'admin');
            document.getElementById('loginError').classList.add('hidden');
        }
        function applyRoleUI() {
            const role = getCurrentRole();
            document.body.dataset.role = role;
            const brandTitle = document.getElementById('portalBrandTitle'); if (brandTitle) brandTitle.innerText = role === 'admin' ? 'Admin Learning Monitor' : "Michelle's Portal";
            const brandSub = document.getElementById('portalBrandSubtitle'); if (brandSub) brandSub.innerText = role === 'admin' ? 'Admin Dashboard' : 'Cikal Serpong SEN Pedagogy';
            const mobileTitle = document.getElementById('mobilePortalTitle'); if (mobileTitle) mobileTitle.innerText = role === 'admin' ? 'Admin Monitor' : "Michelle's Portal";
            document.getElementById('adminNavGroup').classList.toggle('hidden', role !== 'admin');
            document.getElementById('loginOverlay').classList.add('hidden');
            if (role === 'admin') {
                renderAdminDashboard(); renderAdminNotices(); loadCertificateSettings();
                switchTab('adminDashboard');
            } else {
                renderUserNotices(); switchTab('home');
            }
        }
        function checkAuth() {
            if (localStorage.getItem('michelle_auth') === 'true' && !localStorage.getItem('michelle_app_role')) localStorage.setItem('michelle_app_role', 'michelle');
            if (localStorage.getItem('michelle_app_role')) applyRoleUI();
        }
        function handleLogin(e) {
            e.preventDefault();
            const role = document.getElementById('loginRole').value;
            const pass = document.getElementById('loginPass').value.trim();
            const expected = APP_PASSWORDS[role];
            if (pass === expected) {
                localStorage.setItem('michelle_app_role', role);
                if (role === 'michelle') localStorage.setItem('michelle_auth', 'true'); else localStorage.removeItem('michelle_auth');
                applyRoleUI();
                if (typeof confetti === 'function') confetti({ particleCount: 80, spread: 65, origin: { y: 0.6 } });
            } else document.getElementById('loginError').classList.remove('hidden');
        }
        function logout() {
            localStorage.removeItem('michelle_app_role');
            localStorage.removeItem('michelle_auth');
            document.body.dataset.role = '';
            document.getElementById('loginRole').value = 'michelle'; updateLoginRole();
            document.getElementById('loginPass').value = '';
            document.getElementById('loginOverlay').classList.remove('hidden');
        }

        function getNotices() { try { return JSON.parse(localStorage.getItem('michelle_notices') || '[]'); } catch { return []; } }
        function saveNotices(items) { localStorage.setItem('michelle_notices', JSON.stringify(items)); }
        function publishNotice(e) {
            e.preventDefault();
            const items = getNotices();
            items.unshift({ id: Date.now(), title: document.getElementById('noticeTitle').value.trim(), message: document.getElementById('noticeMessage').value.trim(), audience: document.getElementById('noticeAudience').value, createdAt: new Date().toISOString(), readBy: [] });
            saveNotices(items); e.target.reset(); renderAdminNotices(); renderUserNotices(); renderAdminDashboard();
        }
        function deleteNotice(id) { saveNotices(getNotices().filter(n => n.id !== id)); renderAdminNotices(); renderUserNotices(); renderAdminDashboard(); }
        function renderAdminNotices() {
            const list = document.getElementById('adminNoticeList'); if (!list) return;
            const notices = getNotices();
            list.innerHTML = notices.length ? notices.map(n => `<article class="rounded-2xl border border-blue-100 p-4"><div class="flex justify-between gap-3"><b class="text-blue-900">${escapeHtml(n.title)}</b><button onclick="deleteNotice(${n.id})" class="text-rose-500 text-xs">Hapus</button></div><p class="text-sm text-slate-600 mt-2 whitespace-pre-line">${escapeHtml(n.message)}</p><small class="text-slate-400">${n.audience === 'all' ? 'Semua pengguna' : 'Michelle'} · Dibaca ${n.readBy?.includes('michelle') ? '✓' : 'belum'}</small></article>`).join('') : '<p class="text-sm text-slate-500">Belum ada pemberitahuan.</p>';
        }
        function renderUserNotices() {
            const board = document.getElementById('userNoticeBoard'); if (!board) return;
            const all = getNotices().filter(n => n.audience === 'all' || n.audience === 'michelle');
            const read = JSON.parse(localStorage.getItem('michelle_notice_read') || '[]');
            const unread = all.filter(n => !read.includes(n.id));
            board.classList.toggle('hidden', all.length === 0);
            board.innerHTML = all.map(n => `<article class="rounded-2xl border border-blue-200 bg-blue-50 p-4"><div class="flex justify-between gap-3"><div><span class="text-[10px] uppercase font-black text-blue-600">Pemberitahuan</span><h3 class="font-bold text-blue-900">${escapeHtml(n.title)}</h3><p class="text-sm text-blue-900/80 mt-1 whitespace-pre-line">${escapeHtml(n.message)}</p><small class="text-blue-500">${new Date(n.createdAt).toLocaleDateString('id-ID')}</small></div><button onclick="markNoticeRead(${n.id})" class="self-start text-xs text-blue-700 underline">${read.includes(n.id) ? 'Dibaca' : 'Tandai dibaca'}</button></div></article>`).join('');
            if (unread.length) localStorage.setItem('michelle_notice_pending', String(unread.length));
        }
        function markNoticeRead(id) {
            const read = JSON.parse(localStorage.getItem('michelle_notice_read') || '[]'); if (!read.includes(id)) read.push(id);
            localStorage.setItem('michelle_notice_read', JSON.stringify(read));
            const all = getNotices(); const n = all.find(x => x.id === id); if (n && !n.readBy.includes('michelle')) n.readBy.push('michelle'); saveNotices(all);
            renderUserNotices(); renderAdminNotices(); renderAdminDashboard();
        }
        function escapeHtml(value) { return String(value || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
        function renderAdminDashboard() {
            const mastered = document.getElementById('adminMastered'); if (!mastered) return;
            mastered.innerText = vocabList.filter(v => v.mastered).length;
            document.getElementById('adminXP').innerText = `${userXP} XP`;
            document.getElementById('adminSessions').innerText = historyLogs.length;
            const activity = document.getElementById('adminActivityList');
            activity.innerHTML = historyLogs.length ? historyLogs.slice(0, 6).map(log => `<div class="flex justify-between gap-3 border-b border-blue-50 py-2"><span>Sesi belajar #${log.id}</span><b class="text-blue-700">+${log.xp} XP</b></div>`).join('') : '<p>Belum ada sesi belajar tercatat.</p>';
            const notices = getNotices(); const unread = notices.filter(n => !n.readBy?.includes('michelle')).length;
            document.getElementById('adminNoticeStats').innerText = `${notices.length} pemberitahuan terbit · ${unread} belum dibaca Michelle`;
        }
        function loadCertificateSettings() {
            const settings = { ...DEFAULT_CERTIFICATE, ...JSON.parse(localStorage.getItem('michelle_certificate_settings') || '{}') };
            const fields = {certEditName: 'name', certEditTitle: 'title', certEditDescription: 'description', certEditInstitution: 'institution', certEditSigner: 'signer'};
            Object.entries(fields).forEach(([id, key]) => { const el = document.getElementById(id); if (el && !el.value) el.value = settings[key]; });
            applyCertificateSettings(settings);
        }
        function saveCertificateSettings(e) {
            e.preventDefault();
            const settings = { name: document.getElementById('certEditName').value.trim(), title: document.getElementById('certEditTitle').value.trim(), description: document.getElementById('certEditDescription').value.trim(), institution: document.getElementById('certEditInstitution').value.trim(), signer: document.getElementById('certEditSigner').value.trim() };
            localStorage.setItem('michelle_certificate_settings', JSON.stringify(settings)); applyCertificateSettings(settings); alert('Pengaturan sertifikat berhasil disimpan.');
        }
        function applyCertificateSettings(settings) {
            settings = settings || { ...DEFAULT_CERTIFICATE, ...JSON.parse(localStorage.getItem('michelle_certificate_settings') || '{}') };
            const set = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
            set('certTeacherName', settings.name); set('certDescription', settings.description); set('certTitle', settings.title); set('certInstitutionHead', settings.institution.toUpperCase()); set('certInstitutionFoot', settings.institution); set('certSigner', settings.signer);
        }
        function togglePassVisibility() {
            const passInput = document.getElementById('loginPass');
            const eyeIcon = document.getElementById('passEyeIcon');
            if (passInput.type === 'password') {
                passInput.type = 'text';
                eyeIcon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                passInput.type = 'password';
                eyeIcon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        }

        function openAddCaseModal() { document.getElementById('addCaseModal').classList.remove('hidden'); }
        function closeAddCaseModal() { document.getElementById('addCaseModal').classList.add('hidden'); }

        function autoFillStrategyTemplate() {
            const stratArea = document.getElementById('caseStrategyInput');
            stratArea.value = "Apply co-regulation using a calm tone, introduce visual cue cards, provide a short sensory break, and offer structured choices.";
        }

        function handleCaseSubmit(e) {
            e.preventDefault();
            const title = document.getElementById('caseTitleInput').value.trim();
            const topic = document.getElementById('caseTopicInput').value;
            const scenario = document.getElementById('caseScenarioInput').value.trim();
            const strategy = document.getElementById('caseStrategyInput').value.trim();
            const termsRaw = document.getElementById('caseTermsInput').value.trim();
            const keyTerms = termsRaw ? termsRaw.split(',').map(t => t.trim()) : ["Support", "Strategy"];

            const newCase = { id: senCasesList.length + 1, title, topic, scenario, strategy, keyTerms };

            senCasesList.unshift(newCase);
            saveData();
            renderSenCases();
            closeAddCaseModal();
            addXP(20);
            confetti({ particleCount: 50, spread: 50 });
            alert(`Skenario Kasus "${title}" berhasil ditambahkan! ✨`);
        }

        function loadLoveNote() {
            const defaultNote = "Semangat terus belajar Bahasa Inggrisnya yaa Michelle sayang! Kamu guru yang luar biasa dan hebat di Sekolah Cikal Serpong! 💖";
            const savedNote = localStorage.getItem('michelle_love_note');
            document.getElementById('loveNoteDisplay').innerText = `"${savedNote || defaultNote}"`;
        }

        function openEditLoveNoteModal() {
            const current = document.getElementById('loveNoteDisplay').innerText.replace(/^"|"$/g, '');
            document.getElementById('loveNoteInput').value = current;
            document.getElementById('editLoveNoteModal').classList.remove('hidden');
        }

        function closeEditLoveNoteModal() { document.getElementById('editLoveNoteModal').classList.add('hidden'); }

        function handleSaveLoveNote(e) {
            e.preventDefault();
            const text = document.getElementById('loveNoteInput').value.trim();
            if (text) {
                localStorage.setItem('michelle_love_note', text);
                loadLoveNote();
                closeEditLoveNoteModal();
                confetti({ particleCount: 40, spread: 50 });
            }
        }

        function initCikalCalendarWidget() {
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const dateStr = now.toLocaleDateString('id-ID', options);
            document.getElementById('todayDateDisplay').innerText = `Hari ini: ${dateStr}`;
            updateDailyGoalTarget();
        }

        function updateDailyGoalTarget() {
            const sel = document.getElementById('dailyGoalSelect');
            if (sel) {
                dailyGoalTarget = parseInt(sel.value);
                localStorage.setItem('michelle_daily_goal', dailyGoalTarget);
            }
            renderStats();
        }

        function renderStats() {
            const masteredCount = vocabList.filter(v => v.mastered).length;
            const total = vocabList.length;
            const percent = total > 0 ? ((masteredCount / total) * 100).toFixed(1) : 0;

            document.getElementById('statMastered').innerText = masteredCount;
            document.getElementById('statTotalSub').innerText = `Target ${total} Kosakata`;
            document.getElementById('tabDictCount').innerText = total;
            document.getElementById('statPercent').innerText = `${percent}%`;
            document.getElementById('statXP').innerText = `⭐ ${userXP}`;

            const currentDailyDone = Math.min(masteredCount, dailyGoalTarget);
            const goalPercent = Math.min(100, Math.round((currentDailyDone / dailyGoalTarget) * 100));
            document.getElementById('dailyGoalProgressText').innerText = `${currentDailyDone} / ${dailyGoalTarget} Kata`;
            document.getElementById('dailyGoalProgressBar').style.width = `${goalPercent}%`;
        }

        function renderHeatmap() {
            const container = document.getElementById('activityHeatmap');
            container.innerHTML = '';
            for (let i = 0; i < 28; i++) {
                const div = document.createElement('div');
                const isBright = i % 4 === 0 || i === 27;
                div.className = `w-4 h-4 rounded-md ${isBright ? 'bg-pink-400 dark:bg-purple-500' : 'bg-pink-100 dark:bg-purple-950'} border border-pink-200 dark:border-purple-800 flex-shrink-0`;
                div.title = `Hari ke-${i + 1}`;
                container.appendChild(div);
            }
        }

        function renderNoteVocabChips() {
            const container = document.getElementById('noteVocabChips');
            container.innerHTML = '';
            const keyWords = ["Scaffolding", "Differentiation", "Co-regulation", "Formative Assessment", "Neurodiversity", "Accommodation", "Self-Regulation"];
            
            keyWords.forEach(word => {
                const btn = document.createElement('button');
                btn.className = "text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-pink-200 dark:border-purple-800 text-pink-700 dark:text-purple-200 hover:bg-pink-200 transition-all shadow-sm";
                btn.innerText = `+ ${word}`;
                btn.onclick = () => insertWordToNote(word);
                container.appendChild(btn);
            });
        }

        function insertWordToNote(word) {
            const noteArea = document.getElementById('teacherNoteInput');
            noteArea.value += (noteArea.value ? ' ' : '') + word;
            autoSaveNote();
        }

        function autoSaveNote() {
            const text = document.getElementById('teacherNoteInput').value;
            localStorage.setItem('michelle_private_note', text);
            const status = document.getElementById('noteSavedStatus');
            status.classList.remove('hidden');
            setTimeout(() => status.classList.add('hidden'), 2000);
        }

        function loadTeacherNote() {
            const saved = localStorage.getItem('michelle_private_note');
            if (saved) document.getElementById('teacherNoteInput').value = saved;
        }

        function downloadTeacherNote() {
            const text = document.getElementById('teacherNoteInput').value;
            if (!text.trim()) { alert('Belum ada catatan yang ditulis.'); return; }
            const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
            const dlAnchor = document.createElement('a');
            dlAnchor.href = URL.createObjectURL(blob);
            dlAnchor.download = "Michelle_IEP_Lesson_Draft.txt";
            document.body.appendChild(dlAnchor);
            dlAnchor.click();
            dlAnchor.remove();
        }

        const emailTemplatesData = [
            { title: "Kabar Baik Perkembangan Murid", level: "B2", subject: "{student}'s progress this term", body: "Dear {parent},\n\nI hope you are well. I am writing to share positive news about {student}. Over the past few weeks, {student} has shown great progress in class activities.\n\nKind regards,\n{teacher}" },
            { title: "Undangan Pertemuan Orang Tua", level: "B2", subject: "Parent-Teacher Meeting Invitation", body: "Dear {parent},\n\nI would like to invite you to a parent-teacher meeting to discuss {student}'s development on {date}.\n\nKind regards,\n{teacher}" }
        ];

        function renderEmailTemplates() {
            const parent = document.getElementById('tplParentInput').value || "[Parent's Name]";
            const student = document.getElementById('tplStudentInput').value || "[Student's Name]";
            const teacher = document.getElementById('tplTeacherInput').value || "Ms. Michelle";
            const date = document.getElementById('tplDateInput').value || "[Date/Time]";

            const container = document.getElementById('emailTemplatesList');
            container.innerHTML = '';

            emailTemplatesData.forEach(item => {
                let subj = item.subject.replace('{student}', student).replace('{parent}', parent).replace('{teacher}', teacher).replace('{date}', date);
                let bodyText = item.body.replace(/{student}/g, student).replace(/{parent}/g, parent).replace(/{teacher}/g, teacher).replace(/{date}/g, date);

                const card = document.createElement('div');
                card.className = "p-4 rounded-2xl glass-card border border-pink-200 dark:border-purple-800 space-y-2 text-xs";
                card.innerHTML = `
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-pink-800 dark:text-purple-200 text-sm">${item.title}</span>
                        <span class="px-2 py-0.5 rounded bg-pink-100 dark:bg-purple-900/60 text-pink-700 dark:text-purple-200 font-extrabold uppercase">${item.level}</span>
                    </div>
                    <div class="font-bold text-slate-700 dark:text-purple-200">Subject: ${subj}</div>
                    <div class="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-pink-100 dark:border-purple-800 text-slate-600 dark:text-purple-200 whitespace-pre-line leading-relaxed font-sans">${bodyText}</div>
                    <button onclick="copyToClipboard('${bodyText.replace(/\n/g, '\\n').replace(/'/g, "\\'")}')" class="w-full py-2 bg-pink-100 dark:bg-purple-900/60 text-pink-700 dark:text-purple-200 font-bold rounded-xl hover:bg-pink-200 transition-all">
                        <i class="fa-solid fa-copy mr-1"></i> Salin Email Ini
                    </button>
                `;
                container.appendChild(card);
            });
        }

        function copyToClipboard(text) {
            navigator.clipboard.writeText(text);
            alert('Pesan berhasil disalin ke papan klip! ✨');
        }

        function renderTestCefrHome() {
            const container = document.getElementById('testCefrContainer');
            container.innerHTML = `
                <div class="text-center space-y-4">
                    <div class="w-16 h-16 mx-auto rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300 flex items-center justify-center text-3xl">
                        <i class="fa-solid fa-vial"></i>
                    </div>
                    <h3 class="font-serif font-bold text-xl text-pink-800 dark:text-purple-200">Tes Perkiraan Level CEFR</h3>
                    <p class="text-xs text-slate-500 dark:text-purple-300/70 leading-relaxed max-w-md mx-auto">
                        Uji kemampuan Bahasa Inggris kamu meliputi Kosakata, Tata Bahasa (Grammar), Membaca, dan Menyimak Audio.
                    </p>
                    <button onclick="startCefrTest()" class="px-8 py-3 pink-gradient-btn text-white font-bold rounded-2xl shadow-lg text-xs">
                        Mulai Tes Level Sekarang
                    </button>
                </div>
            `;
        }

        function startCefrTest() {
            const container = document.getElementById('testCefrContainer');
            container.innerHTML = `
                <div class="space-y-4 text-center">
                    <span class="text-xs font-bold text-pink-600 dark:text-purple-300">Pertanyaan 1 dari 5</span>
                    <h4 class="font-bold text-base text-slate-800 dark:text-purple-100">She ___ to school by bus every day.</h4>
                    <div class="grid grid-cols-1 gap-2 text-xs">
                        <button onclick="finishCefrTest(true)" class="p-3 rounded-xl border border-pink-200 dark:border-purple-800 bg-white dark:bg-slate-900 font-semibold hover:bg-pink-50">goes</button>
                        <button onclick="finishCefrTest(false)" class="p-3 rounded-xl border border-pink-200 dark:border-purple-800 bg-white dark:bg-slate-900 font-semibold hover:bg-pink-50">go</button>
                    </div>
                </div>
            `;
        }

        function finishCefrTest(isCorrect) {
            if (isCorrect) addXP(30);
            const container = document.getElementById('testCefrContainer');
            container.innerHTML = `
                <div class="text-center space-y-4">
                    <div class="text-4xl font-extrabold text-pink-600 dark:text-purple-300 font-fredoka">Level B2 / C1</div>
                    <p class="text-xs text-slate-600 dark:text-purple-200">Luar biasa! Hasil tes menunjukkan penguasaan yang sangat baik untuk standar mengajar Cikal!</p>
                    <button onclick="renderTestCefrHome()" class="px-6 py-2.5 pink-gradient-btn text-white font-bold rounded-xl text-xs">Selesai</button>
                </div>
            `;
            confetti({ particleCount: 80, spread: 60 });
        }

        function renderDictionary() {
            const search = document.getElementById('searchInput').value.toLowerCase();
            const lvl = document.getElementById('dictLevelFilter').value;
            const status = document.getElementById('dictStatusFilter').value;

            const list = document.getElementById('dictList');
            list.innerHTML = '';

            const filtered = vocabList.filter(v => {
                const matchSearch = v.word.toLowerCase().includes(search) || v.meaning.toLowerCase().includes(search);
                const matchLvl = (lvl === 'ALL') || (v.level === lvl);
                const matchStatus = (status === 'ALL') || 
                                    (status === 'MASTERED' && v.mastered) || 
                                    (status === 'UNMASTERED' && !v.mastered);
                return matchSearch && matchLvl && matchStatus;
            });

            filtered.forEach(item => {
                const div = document.createElement('div');
                div.className = `p-3.5 rounded-2xl glass-card border ${item.mastered ? 'border-emerald-200 bg-emerald-50/20 dark:border-emerald-800 dark:bg-emerald-950/20' : 'border-pink-100 dark:border-purple-800'} flex justify-between items-center`;
                div.innerHTML = `
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-bold text-pink-800 dark:text-purple-200">${item.word}</span>
                            <span class="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-pink-100 dark:bg-purple-900/60 text-pink-600 dark:text-purple-300">${item.level}</span>
                        </div>
                        <p class="text-xs text-slate-600 dark:text-purple-300/80 mt-0.5">${item.meaning}</p>
                    </div>
                    <button onclick="toggleDictMastered(${item.id})" class="text-lg ${item.mastered ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-700 hover:text-pink-400'}">
                        <i class="fa-solid fa-circle-check"></i>
                    </button>
                `;
                list.appendChild(div);
            });
        }

        function toggleDictMastered(id) {
            const target = vocabList.find(v => v.id === id);
            if (target) {
                target.mastered = !target.mastered;
                saveData();
                renderStats();
                renderDictionary();
                renderCurrentCard();
            }
        }

        function openAddVocabModal() { document.getElementById('addVocabModal').classList.remove('hidden'); }
        function closeAddVocabModal() { document.getElementById('addVocabModal').classList.add('hidden'); }

        function handleAddVocabSubmit(e) {
            e.preventDefault();
            const word = document.getElementById('newWord').value.trim();
            const level = document.getElementById('newLevel').value;
            const category = document.getElementById('newCategory').value;
            const meaning = document.getElementById('newMeaning').value.trim();
            const context = document.getElementById('newContext').value.trim() || `Example context for ${word}.`;

            vocabList.unshift({ id: vocabList.length + 1, word, level, meaning, phonetic: `/${word.toLowerCase()}/`, context, category, mastered: false, srsBox: 1 });
            saveData();
            renderStats();
            filterFlashcards();
            renderDictionary();
            closeAddVocabModal();
            alert(`Kosakata "${word}" berhasil ditambahkan! ✨`);
        }

        function exportDataJSON() {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(vocabList, null, 2));
            const dlAnchor = document.createElement('a');
            dlAnchor.setAttribute("href", dataStr);
            dlAnchor.setAttribute("download", "Michelle_Cambridge_Vocab_Backup.json");
            document.body.appendChild(dlAnchor);
            dlAnchor.click();
            dlAnchor.remove();
        }

        function startQuiz() {
            document.getElementById('quizStartScreen').classList.add('hidden');
            document.getElementById('quizResultScreen').classList.add('hidden');
            document.getElementById('quizPlayScreen').classList.remove('hidden');

            const shuffled = [...vocabList].sort(() => 0.5 - Math.random());
            quizState = { current: 0, score: 0, questions: shuffled.slice(0, 5) };
            renderQuizQuestion();
        }

        function renderQuizQuestion() {
            const q = quizState.questions[quizState.current];
            document.getElementById('quizProgress').innerText = `Pertanyaan ${quizState.current + 1} / 5`;
            document.getElementById('quizScore').innerText = `Skor: ${quizState.score}`;
            document.getElementById('quizLevelBadge').innerText = `Level ${q.level}`;
            document.getElementById('quizQuestion').innerText = `Apa arti dari kosakata "${q.word}"?`;

            const options = [q.meaning];
            while (options.length < 4 && vocabList.length > 1) {
                const rand = vocabList[Math.floor(Math.random() * vocabList.length)].meaning;
                if (!options.includes(rand)) options.push(rand);
            }
            options.sort(() => 0.5 - Math.random());

            const container = document.getElementById('quizOptions');
            container.innerHTML = '';
            options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = "w-full p-3 rounded-xl border border-pink-200 dark:border-purple-800 bg-white/80 dark:bg-slate-900/80 text-xs font-semibold text-slate-700 dark:text-purple-200 hover:bg-pink-50 transition-all text-left";
                btn.innerText = opt;
                btn.onclick = () => answerQuiz(opt === q.meaning);
                container.appendChild(btn);
            });
        }

        function answerQuiz(isCorrect) {
            if (isCorrect) {
                quizState.score += 20;
                addXP(5);
            }
            quizState.current++;
            if (quizState.current < 5) renderQuizQuestion();
            else showQuizResults();
        }

        function showQuizResults() {
            document.getElementById('quizPlayScreen').classList.add('hidden');
            document.getElementById('quizResultScreen').classList.remove('hidden');
            document.getElementById('quizResultText').innerText = `Skor Akhir Michelle: ${quizState.score} / 100`;
            if (quizState.score >= 80) confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
    









