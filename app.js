// ==========================================
// [플레이어 초기 상태 및 데이터 정의]
// ==========================================
let hp = 50;                 
let socialScore = 100;        
let currentRound = 1;
let currentNpc = null;
let isClickable = true;

let gameStats = {
    correctDecisions: 0, 
    yellowInteractions: 0, 
    falsePositive: 0, 
    falseNegative: 0  
};

const npcPool = {
    Red: [
        { name: "피부에 진물이 흐르는 사람", desc: "삼출물은 전염성 강한 병원균의 직접적 매개체로 인류가 가장 강하게 기피하도록 진화한 혐오 단서입니다." },
        { name: "독한 구취와 악취를 풍기는 사람", desc: "부패 가스와 박테리아 증식 신호로, 미생물 오염원을 차단하라는 강력한 후각적 거부 반응을 유발합니다." },
        { name: "곰팡이가 핀 음식을 들고 있는 사람", desc: "곰팡이 독소는 치명적인 소화기 감염을 유발하므로 인지 체계가 오염 집단으로 즉시 분류합니다." },
        { name: "오물이 잔뜩 묻은 옷을 입은 사람", desc: "위생 인프라의 부재는 병원균의 온상입니다. 뇌는 의복의 청결도로 상대의 오염 확률을 계산합니다." },
        { name: "눈이 붉게 충혈되고 끊임없이 눈물을 흘리는 사람", desc: "바이러스성 결막염 등 점막을 통한 전염병의 전형적인 증상으로 생리적 기피 대상 1순위입니다." },
        { name: "입가에 정체 모를 거품과 침을 흘리는 사람", desc: "신경계 감염이나 인수공통감염병(광견병 등)의 징후로, 타액 접촉을 막기 위한 강한 공포를 유발합니다." },
        { name: "손에 정체 모를 붉은 반점이 가득한 사람", desc: "천연두, 페스트 등 인류를 몰살했던 급성 전염병의 발진 증상으로 인류의 유전자에 각인된 위험 신호입니다." },
        { name: "땀을 비 오듯 흘리며 거칠게 숨을 몰아쉬는 사람", desc: "고열을 동반한 호흡기 질환의 단서로, 비말 감염 반경 내에 있음을 경고하는 생학적 지표입니다." },
        { name: "파리떼가 주변에 꼬여 있는 노숙인", desc: "해충은 병원균을 옮기는 최적의 매개체(Vector)입니다. 파리는 인지적으로 강력한 기피 대상입니다." },
        { name: "상처 부위를 묶은 붕대가 시커멓게 변색된 사람", desc: "조직 괴사 및 2차 세균 감염 신호로, 접촉 시 패혈증균 등이 전면 전파될 수 있는 고위험군입니다." }
    ],
    Yellow: [
        { name: "연신 기침을 하는 사람", desc: "단순 알레르기일 수 있으나 결핵이나 독감의 비말 확산 기전일 수 있어 행동 면역계가 경계하는 대표적 모호 단서입니다." },
        { name: "아주 낡은 의복을 입은 외지인", desc: "진화 역사에서 외지인은 우리 부족에게 면역력이 없는 '치명적 외래 병원균'을 보유했을 확률이 높아 경계 대상이었습니다." },
        { name: "씻지 않은 손으로 음식을 권하는 사람", desc: "위생 규칙(Taboo) 위반 행위는 병원균 전파 확률을 높이므로, 사회적 도덕성과 위생 관념이 결합된 경계 대상입니다." },
        { name: "식은땀을 흘리고 있는 사람", desc: "체온 조절 실패는 체내 면역계가 바이러스와 싸우고 있다는 전조 증상으로 잠재적 감염 상태를 뜻합니다." },
        { name: "얼굴이 비정상적으로 창백하고 부어오른 사람", desc: "림프계 질환이나 내부 장기 손상, 혹은 전염성 초기 부종의 가능성이 결합된 중간 단계 단서입니다." },
        { name: "목소리가 심하게 쉬어 있고 쌕쌕거리는 사람", desc: "상기도 감염(후두염, 백일해 등)의 청각적 신호로, 목소리 변화 또한 행동 면역계의 탐색 지표 중 하나입니다." },
        { name: "얼굴을 알아볼 수 없게 깊은 망토를 뒤집어쓴 사람", desc: "외형적 청결도나 건강 상태를 확인할 수 없을 때, 뇌는 불확실성을 회피하기 위해 방어 기제를 가동합니다." },
        { name: "진흙과 먼지를 온몸에 뒤집어쓴 광부", desc: "단순 노동의 흔적이지만 오염물질 접촉도가 높아 행동 면역계가 위생 상태를 명확히 인지하기 전까지 유보합니다." },
        { name: "독특한 향신료와 기괴한 냄새가 섞여 나는 상인", desc: "부족에게 익숙하지 않은 낯선 향과 풍미는 뇌에서 독성이나 감염원으로 잠재적 분류될 확률이 존재합니다." },
        { name: "몸을 심하게 떨며 비틀거리는 사람", desc: "운동 신경 이상은 감염병으로 인한 고열 증상이거나 뇌 손상 신호일 수 있어 예의주시해야 하는 단서입니다." }
    ],
    Green: [
        { name: "얼굴에 큰 화상 흉터가 있는 사람", desc: "전염성이 전혀 없는 비외상성 상처임에도, 행동 면역계의 시각 센서가 '피부 손상=감염병'으로 오인(False Positive)하는 가짜 단서입니다." },
        { name: "허리가 심하게 굽은 고령의 노인", desc: "자연스러운 노화 현상이지만 신체 왜곡 단서로 작용하여 행동 면역계가 비정상 신호로 오경보를 울릴 수 있습니다." },
        { name: "체형이 매우 비만인 사람", desc: "대사증후군 성향일 뿐 병원체와 무관하나, 진화심리학적으로 표준적 형태에서 벗어난 외형은 무의식적 경계를 유발하곤 합니다." },
        { name: "매끄러운 피부를 가진 사람", desc: "진화론적으로 '기생충에 감염되지 않고 건강하게 자랐음'을 증명하는 가장 완벽한 건강과 안전의 지표입니다." },
        { name: "백반증으로 인해 피부 얼룩이 심한 사람", desc: "자가면역질환으로 전염성이 0%이나, 피부 얼룩 단서가 천연두 등의 발진과 시각적으로 유사하여 오경보가 자주 발생합니다." },
        { name: "사시(눈동자 정렬 불일치)를 가진 사람", desc: "선천적 발달 특징일 뿐이지만, 대칭성을 선호하는 인류의 인지 매커니즘이 병원균 징후로 오탐지하기 쉬운 취약한 단서입니다." },
        { name: "선천적으로 다리를 심하게 저는 사람", desc: "지체 장애는 타인에게 전파되지 않으나, 비정상적 걸음걸이가 신경계 감염병 증상과 오인되어 차별받기 쉬운 인지적 희생양입니다." },
        { name: "얼굴에 여드름과 흉터가 가득한 사춘기 소년", desc: "호르몬 분비로 인한 무해한 피부 변화이지만, 행동 면역 체계는 농포성 질환과 구별하지 못해 거부감을 유도합니다." },
        { name: "피부색이 우리 부족과 완전히 다른 사람", desc: "단순 인종적 차이일 뿐 건강과 무관하나, 원시 부족 사회의 내집단 선호(Xenophobia) 기제가 BIS와 결합해 오작동하는 사례입니다." },
        { name: "독특한 피어싱과 문신을 온몸에 한 사람", desc: "자발적 문화 표현이지만 피부 장벽의 인위적 훼손으로 비춰져, 위생 관념 무의식이 순간적으로 경계할 수 있는 요소입니다." }
    ]
};

// ==========================================
// [내비게이션 및 흐름 제어]
// ==========================================
function nextCard(cardNumber) {
    document.getElementById('card-1').classList.remove('active');
    document.getElementById('card-2').classList.remove('active');
    document.getElementById(`card-${cardNumber}`).classList.add('active');
}

function startGame() {
    hp = 50;
    socialScore = 100;
    currentRound = 1;
    
    gameStats.correctDecisions = 0;
    gameStats.yellowInteractions = 0;
    gameStats.falsePositive = 0;
    gameStats.falseNegative = 0;
    isClickable = true;

    // 시각 스타일 복원
    document.body.classList.remove('crisis-mode');
    document.getElementById('game-container').classList.remove('crisis-border');
    document.getElementById('crisis-banner').classList.add('hidden');

    document.getElementById('intro-section').classList.add('hidden');
    document.getElementById('ending-section').classList.add('hidden');
    document.getElementById('outro-section').classList.add('hidden');
    document.getElementById('game-section').classList.remove('hidden');

    updateUI();
    spawnNpc();
}

function updateUI() {
    document.getElementById('round-txt').innerText = currentRound;
    document.getElementById('hp-txt').innerText = hp;
    document.getElementById('score-txt').innerText = socialScore;

    // 💡 [신규 반영] 20라운드 초과(21라운드 진입) 시 위기 모드 시각화 활성화
    if (currentRound > 20) {
        document.body.classList.add('crisis-mode');
        document.getElementById('game-container').classList.add('crisis-border');
        document.getElementById('crisis-banner').classList.remove('hidden');
    }
}

// ==========================================
// [라운드 기반 조건 확률 NPC 출몰 엔진]
// ==========================================
function spawnNpc() {
    let chosenColor = "Green";
    const rand = Math.random() * 100;

    if (currentRound >= 1 && currentRound <= 7) {
        if (rand < 50) chosenColor = "Green";
        else if (rand < 75) chosenColor = "Red";
        else chosenColor = "Yellow";
    } else if (currentRound >= 8 && currentRound <= 14) {
        if (rand < 50) chosenColor = "Yellow";
        else if (rand < 75) chosenColor = "Green";
        else chosenColor = "Red";
    } else {
        if (rand < 50) chosenColor = "Red";
        else if (rand < 75) chosenColor = "Green";
        else chosenColor = "Yellow";
    }

    const currentList = npcPool[chosenColor];
    currentNpc = currentList[Math.floor(Math.random() * currentList.length)];
    currentNpc.type = chosenColor;

    document.getElementById('npc-name').innerText = currentNpc.name;
    isClickable = true;
}

// ==========================================
// [상호작용 연산 및 동적 확률 변화 시스템]
// ==========================================
function handleChoice(isInteract) {
    if (!isClickable) return;
    isClickable = false;

    let logMessage = "";
    let hpChange = 0;
    let scoreChange = 0;
    let actualType = currentNpc.type;

    if (isInteract) {
        if (actualType === "Green") {
            scoreChange = 15;
            gameStats.correctDecisions++; 
            logMessage = `✅ Green 이웃과 안심하고 교류했습니다. (사회적 점수 +15)`;
        } 
        else if (actualType === "Yellow") {
            gameStats.yellowInteractions++; 

            // 🎲 [신규 반영] 라운드 수에 따른 동적 확률 분기 적용
            if (currentRound > 20) {
                // 20라운드 초과: 25% 성공, 75% 실패 (하드코어 위기 돌입)
                if (Math.random() < 0.25) {
                    hpChange = 0;
                    scoreChange = 10;
                    logMessage = `✨ [위기 극복 대성공] 25%의 소수 확률을 뚫고 안전하게 교류했습니다! (사회적 점수 +10)`;
                } else {
                    hpChange = -5;
                    logMessage = `🚨 [위기 감염 대실패] 75%의 고확률에 감염되었습니다! (면역력 -5)`;
                }
            } else {
                // 기존 1~20라운드 기본 설정: 50% 성공, 50% 실패
                if (Math.random() < 0.5) {
                    hpChange = 0;
                    scoreChange = 10;
                    logMessage = `✨ [Yellow 교류 성공] 위험 요인을 극복하고 안전하게 교류했습니다. (사회적 점수 +10)`;
                } else {
                    hpChange = -5;
                    logMessage = `⚠️ [Yellow 교류 실패] 이웃과 접촉 후 감염과 마찰이 발생했습니다. (면역력 -5)`;
                }
            }
        } 
        else if (actualType === "Red") {
            hpChange = -15;
            gameStats.falseNegative++; 
            logMessage = `🚨 [False Negative] 위험한 오염원과 접촉하여 감염되었습니다! (면역력 -15)`;
        }
    } else {
        if (actualType === "Green") {
            scoreChange = -15; 
            gameStats.falsePositive++; 
            logMessage = `🔍 [False Positive] 무해한 이웃을 과잉 경계하여 거부했습니다. (사회적 점수 -15)`;
        } 
        else if (actualType === "Yellow") {
            scoreChange = -10; 
            logMessage = `🛡️ 확실하지 않은 상태의 이웃을 선제적으로 차단해 안전을 확보했습니다. (사회적 점수 -10)`;
        } 
        else if (actualType === "Red") {
            scoreChange = -5;  
            gameStats.correctDecisions++; 
            logMessage = `🛡️ 탁월한 기피! 오염원을 차단해 감염을 차단했습니다. (사회적 점수 -5)`;
        }
    }

    hp += hpChange;
    socialScore += scoreChange;

    if (hp < 0) hp = 0;
    if (socialScore < 0) socialScore = 0;

    updateUI();
    document.getElementById('log-box').innerText = logMessage;

    setTimeout(() => {
        if (hp <= 0) {
            endGame();
        } else {
            currentRound++;
            updateUI(); // 라운드가 오르며 위기 배너 노출 타이밍 연동
            spawnNpc();
            document.getElementById('log-box').innerText = "이웃이 다가옵니다. 어떤 선택을 하시겠습니까?";
        }
    }, 1800);
}

// ==========================================
// [3단계: Game Over 단순 결과창]
// ==========================================
function endGame() {
    document.getElementById('game-section').classList.add('hidden');
    document.getElementById('ending-section').classList.remove('hidden');

    document.getElementById('end-round').innerText = currentRound;
    document.getElementById('end-score').innerText = socialScore;
}

// ==========================================
// [4단계: Outro 심층 리포트 데이터 화면 처리]
// ==========================================
function showOutro() {
    // 1. 화면 전환 처리
    document.getElementById('ending-section').classList.add('hidden');
    document.getElementById('outro-section').classList.remove('hidden');

    // 2. 신호 탐지 이론 통계 데이터 삽입
    document.getElementById('stat-correct').innerText = gameStats.correctDecisions;
    document.getElementById('stat-yellow-int').innerText = gameStats.yellowInteractions;
    document.getElementById('stat-fp').innerText = gameStats.falsePositive;
    document.getElementById('stat-fn').innerText = gameStats.falseNegative;

    // 3. 행동 면역 체계(BIS) 성향 진단 텍스트 연산
    let profileDesc = "";
    if (gameStats.falsePositive > gameStats.falseNegative && gameStats.falsePositive >= 3) {
        profileDesc = `🛡️ <b>초위생적 하이퍼-가드(Hyper-Guard) 유형:</b><br>당신의 행동 면역 체계는 극도로 예민하게 세팅되어 있습니다. 병원균 유입 가능성을 제로로 만들기 위해 무해한 이웃(Green)마저 공격적으로 차단하는 과잉 예방(False Positive) 전략을 취했습니다. 역사적으로 감염병 대유행기에는 생존에 유리했으나, 평시에는 고립과 자원 부족을 겪기 쉬운 인지 구조입니다.`;
    } else if (gameStats.falseNegative > gameStats.falsePositive && gameStats.falseNegative >= 3) {
        profileDesc = `🤝 <b>포용적 소셜-위험 수용(Social Risk-Taker) 유형:</b><br>당신은 감염의 위험보다 사회적 연결과 상호작용의 이득을 훨씬 높게 평가하는 성향입니다. 위험 징후(Red)가 뚜렷함에도 상호작용(False Negative)을 지속하여 면역력이 빠르게 깎였습니다. 부족 내에서 결속을 강화하고 자원을 획득하는 데는 유리하지만, 역병 앞에서는 진화적으로 취약했던 조상들의 심리 메커니즘을 투영합니다.`;
    } else if (gameStats.yellowInteractions > gameStats.correctDecisions) {
        profileDesc = `🎲 <b>기회주의적 도박사(Opportunistic Gambler) 유형:</b><br>확실한 안전이나 위험보다는 경계선에 있는 모호한 대상(Yellow)에게 매력을 느끼고 베팅하는 경향이 짙습니다. 특히 후반부 위기 상황 속 75%의 위험률 앞에서도 과감하게 주사위를 던지는 모험가적 진화 전략을 보여줍니다.`;
    } else {
        profileDesc = `⚖️ <b>진화론적 균형주의자(Balanced Adaptor) 유형:</b><br>위험 인자는 정밀하게 식별해 거부하고, 안전한 단서는 합리적으로 수용하여 오경보(False Positive)와 오탐지(False Negative)의 균형을 완벽히 통제했습니다. 행동 면역 체계의 방어 비용과 사회적 교류 비용 사이에서 최적의 손익분기점을 찾아낸 가장 안정적인 적응형 인지 모델입니다.`;
    }

    // [디버그 포인트] 성향 진단 영역을 먼저 깨끗이 비운 뒤 연산된 최종 텍스트만 주입합니다.
    const profileBox = document.getElementById('bis-profile');
    if (profileBox) {
        profileBox.innerHTML = profileDesc;
    }

    // 4. 학술 아카이브 전체 NPC 동적 도감화 생성
    const archiveBox = document.getElementById('npc-archive');
    if (archiveBox) {
        archiveBox.innerHTML = ""; // 기존 잔여 도감 데이터 초기화

        const groups = ["Red", "Yellow", "Green"];
        groups.forEach(groupName => {
            let tagClass = `tag-${groupName.toLowerCase()}`;
            
            npcPool[groupName].forEach(npc => {
                const item = document.createElement('div');
                item.className = "archive-item";
                item.innerHTML = `[<span class="${tagClass}">${groupName}</span>] <b>${npc.name}</b><br><span style="color:#64748b; font-size:0.83rem;">- ${npc.desc}</span>`;
                archiveBox.appendChild(item);
            });
        });
    }
}