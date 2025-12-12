window.addEventListener("load", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const xpBarElem = document.getElementById("xpBar");
    
    // =================================================================
    // REFERÊNCIAS DOS MENUS E BOTÕES
    // =================================================================
    const mainMenu = document.getElementById("mainMenu");
    const pauseMenu = document.getElementById("pauseMenu");
    const controlsMenu = document.getElementById("controlsMenu");
    const upgradeMenu = document.getElementById("upgradeMenu"); // O DIV principal

    // Botões de navegação
    const startButton = document.getElementById("startButton");
    const resumeButton = document.getElementById("resumeButton");
    const returnToMainButton = document.getElementById("returnToMainButton");
    const controlsFromMainButton = document.getElementById("controlsFromMainButton");
    const controlsFromPauseButton = document.getElementById("controlsFromPauseButton");
    const backFromControlsButton = document.getElementById("backFromControlsButton");

    // Créditos
    const creditsMenu = document.getElementById("creditsMenu");
    const creditsButton = document.getElementById("creditsButton");
    const backFromCreditsButton = document.getElementById("backFromCreditsButton");
    // =================================================================

    const IMG_PATH = "assets/";

    // =================================================================
    // --- SPRITES: Jogador
    // O tamanho do player é 48x48, então todos os sprites devem ser desenhados nesse tamanho.
    // =================================================================
    
    // Sprites Parados (Um único sprite por direção/tier)
    const playerSpritesStandLeft = {
        1: IMG_PATH + "COURO.png",
        2: IMG_PATH + "PRATA.png",
        3: IMG_PATH + "OURO.png",
        4: IMG_PATH + "DIAMANTE.png",
        5: IMG_PATH + "LENDARIO.png"
    };
    const playerSpritesStandRight = {
        1: IMG_PATH + "COURODIREITA.png",
        2: IMG_PATH + "PRATADIREITA.png",
        3: IMG_PATH + "OURODIREITA.png",
        4: IMG_PATH + "DIAMANTEDIREITA.png",
        5: IMG_PATH + "LENDARIODIREITA.png"
    };
    const playerSpritesStandUp = {
        1: IMG_PATH + "COUROCOSTAS.png",
        2: IMG_PATH + "PRATACOSTAS.png",
        3: IMG_PATH + "OUROCOSTAS.png",
        4: IMG_PATH + "DIAMANTECOSTAS.png",
        5: IMG_PATH + "LENDARIOCOSTAS.png"
    };
    
    // Sprites de Caminhada (Dois sprites por direção/tier)
    const playerSpritesWalkLeft = {
        1: [IMG_PATH + "COURO_WALK_L_1.png", IMG_PATH + "COURO_WALK_L_2.png"],
        2: [IMG_PATH + "PRATA_WALK_L_1.png", IMG_PATH + "PRATA_WALK_L_2.png"], // Assumindo nomes
        3: [IMG_PATH + "OURO_WALK_L_1.png", IMG_PATH + "OURO_WALK_L_2.png"],
        4: [IMG_PATH + "DIAMANTE_WALK_L_1.png", IMG_PATH + "DIAMANTE_WALK_L_2.png"],
        5: [IMG_PATH + "LENDARIO_WALK_L_1.png", IMG_PATH + "LENDARIO_WALK_L_2.png"],
    };
    const playerSpritesWalkRight = {
        1: [IMG_PATH + "COURO_WALK_R_1.png", IMG_PATH + "COURO_WALK_R_2.png"],
        2: [IMG_PATH + "PRATA_WALK_R_1.png", IMG_PATH + "PRATA_WALK_R_2.png"],
        3: [IMG_PATH + "OURO_WALK_R_1.png", IMG_PATH + "OURO_WALK_R_2.png"],
        4: [IMG_PATH + "DIAMANTE_WALK_R_1.png", IMG_PATH + "DIAMANTE_WALK_R_2.png"],
        5: [IMG_PATH + "LENDARIO_WALK_R_1.png", IMG_PATH + "LENDARIO_WALK_R_2.png"],
    };
    const playerSpritesWalkUp = {
        1: [IMG_PATH + "COURO_WALK_U_1.png", IMG_PATH + "COURO_WALK_U_2.png"],
        2: [IMG_PATH + "PRATA_WALK_U_1.png", IMG_PATH + "PRATA_WALK_U_2.png"],
        3: [IMG_PATH + "OURO_WALK_U_1.png", IMG_PATH + "OURO_WALK_U_2.png"],
        4: [IMG_PATH + "DIAMANTE_WALK_U_1.png", IMG_PATH + "DIAMANTE_WALK_U_2.png"],
        5: [IMG_PATH + "LENDARIO_WALK_U_1.png", IMG_PATH + "LENDARIO_WALK_U_2.png"],
    };

    // =================================================================
    // PRÉ-CARREGAMENTO DOS SPRITES DO JOGADOR
    // =================================================================
    const loadedPlayerSprites = {
        stand: { left: {}, right: {}, up: {} },
        walk: { left: {}, right: {}, up: {} }
    };

    function preloadPlayerSprites() {
        const loadSet = (sourceMap, destMap, isWalk = false) => {
            for(const tier in sourceMap) {
                
                // CORREÇÃO APLICADA: Se não for caminhada (stand), armazena a Image diretamente.
                if (!isWalk) {
                    const img = new Image();
                    img.src = sourceMap[tier]; 
                    destMap[tier] = img; // Armazena a Image diretamente (sem array)
                    continue; 
                }
                
                // Lógica para sprites de caminhada (arrays de imagens)
                const sources = sourceMap[tier];
                destMap[tier] = [];
                sources.forEach(src => {
                    const img = new Image();
                    img.src = src; 
                    destMap[tier].push(img);
                });
            }
        };

        // Carregando sprites parados (isWalk=false)
        loadSet(playerSpritesStandLeft, loadedPlayerSprites.stand.left, false);
        loadSet(playerSpritesStandRight, loadedPlayerSprites.stand.right, false);
        loadSet(playerSpritesStandUp, loadedPlayerSprites.stand.up, false);
        
        // Carregando sprites de caminhada (isWalk=true)
        loadSet(playerSpritesWalkLeft, loadedPlayerSprites.walk.left, true);
        loadSet(playerSpritesWalkRight, loadedPlayerSprites.walk.right, true);
        loadSet(playerSpritesWalkUp, loadedPlayerSprites.walk.up, true);
    }
    preloadPlayerSprites(); 
    // =================================================================

    // --- SPRITES: Monstros
    const monsterSpritesByTierLeft = {
        1: IMG_PATH + "JELLY.png",
        2: IMG_PATH + "ROXINHO.png",
        3: IMG_PATH + "AZULAO.png",
        4: IMG_PATH + "TIGRAO.png",
        5: IMG_PATH + "FINALBOSS.png"
    };
    
    const monsterSpritesByTierRight = {
        1: IMG_PATH + "JELLYDIREITA.png",
        2: IMG_PATH + "ROXINHODIREITA.png",
        3: IMG_PATH + "AZULAODIREITA.png",
        4: IMG_PATH + "TIGRAODIREITA.png",
        5: IMG_PATH + "FINALBOSSDIREITA.png"
    };
    
    // =================================================================
    // PRÉ-CARREGAMENTO DOS SPRITES DOS MONSTROS
    // =================================================================
    const loadedMonsterSprites = {
        left: {},
        right: {}
    };

    function preloadMonsterSprites() {
        const loadSet = (sourceMap, destMap) => {
            for(const tier in sourceMap) {
                const img = new Image();
                img.src = sourceMap[tier]; 
                destMap[tier] = img;
            }
        };

        loadSet(monsterSpritesByTierLeft, loadedMonsterSprites.left);
        loadSet(monsterSpritesByTierRight, loadedMonsterSprites.right);
    }
    preloadMonsterSprites(); 
    // =================================================================

    const mapImg = new Image(); mapImg.src = IMG_PATH + "MAP.png";
    const mapDarkImg = new Image(); mapDarkImg.src = IMG_PATH + "MAPDARK.png";
    const gameOverImg = new Image(); gameOverImg.src = IMG_PATH + "GAMEOVER.png";
    const winImg = new Image(); winImg.src = IMG_PATH + "WIN.png";
    const coracaoImg = new Image(); coracaoImg.src = IMG_PATH + "CORACAO.png";
    const coracaoRoxoImg = new Image(); coracaoRoxoImg.src = IMG_PATH + "CORACAOROXO.png";
    
    // =================================================================
    // --- NOVO: CONFIGURAÇÃO DE ITENS DE CURA (ATENDE AOS REQUISITOS)
    // =================================================================
    const ITEM_DROPS = {
        CORACAO_VERMELHO: {
            imagem: coracaoImg,
            cura: 50,           // Requisito 1: Cura 50 HP (antes era ~30 HP)
            dropRate: 0.18,      // 18% de chance
            nivelMinimo: 1,
            ttl: 15000           // Tempo de vida do item no chão
        },
        CORACAO_ROXO: {
            imagem: coracaoRoxoImg,
            cura: 150,          // Cura alta para coração raro
            dropRate: 0.10,      // Requisito 2: 10% de chance
            nivelMinimo: 20,     // Requisito 3: Só a partir do Lv 20
            ttl: 15000
        }
    };
    // =================================================================
        
    const fireballImg = new Image(); fireballImg.src = IMG_PATH + "BOLADEFOGO.png";
    const FIREBALL_DMG_PERCENT = 0.25; 
    const FIREBALL_SPEED = 4.5;	
    const BOSS_FIRE_RATE = 2000; 

    const bloodImg = new Image(); bloodImg.src = IMG_PATH + "SANGUE.png"; 

    // (Códigos de ÁUDIO omitidos para brevidade, eram os mesmos)
    const SWORD_SOUND_VOLUME = 0.6;
    const SWORD_POOL_SIZE = 4; 
    const swordSoundPool = [];
    for (let i = 0; i < SWORD_POOL_SIZE; i++) { swordSoundPool.push(new Audio(IMG_PATH + "ESPADA.mp3")); swordSoundPool[i].volume = SWORD_SOUND_VOLUME; }
    let currentSoundIndex = 0;
    
    const IMPACT_SOUND_VOLUME = 0.4; 
    const IMPACT_POOL_SIZE = 3; 
    const impactSoundPool = [];
    for (let i = 0; i < IMPACT_POOL_SIZE; i++) { impactSoundPool.push(new Audio(IMG_PATH + "IMPACTO.mp3")); impactSoundPool[i].volume = IMPACT_SOUND_VOLUME; }
    let currentImpactIndex = 0;

    const WALK_SOUND_VOLUME = 0.2; 
    const walkSound = new Audio(IMG_PATH + "ANDAR.mp3");
    walkSound.volume = WALK_SOUND_VOLUME;
    walkSound.loop = true; 
    
    const LEVEL_UP_SOUND_VOLUME = 0.5; 
    const levelUpSound = new Audio(IMG_PATH + "LEVELUP.mp3");
    levelUpSound.volume = LEVEL_UP_SOUND_VOLUME;
    
    const FIREBALL_SOUND_VOLUME = 0.3; 
    const FIREBALL_POOL_SIZE = 3; 
    const fireballSoundPool = [];
    for (let i = 0; i < FIREBALL_POOL_SIZE; i++) { fireballSoundPool.push(new Audio(IMG_PATH + "BOLADEFOGO.mp3")); fireballSoundPool[i].volume = FIREBALL_SOUND_VOLUME; }
    let currentFireballIndex = 0;

    const PLAYER_HIT_SOUND_VOLUME = 0.7; 
    const PLAYER_HIT_POOL_SIZE = 2; 
    const playerHitSoundPool = [];
    for (let i = 0; i < PLAYER_HIT_POOL_SIZE; i++) { playerHitSoundPool.push(new Audio(IMG_PATH + "SOCO.mp3")); playerHitSoundPool[i].volume = PLAYER_HIT_SOUND_VOLUME; }
    let currentHitIndex = 0;
    // =================================================================

    // =================================================================
    // SPRITES: ESPADA
    // =================================================================
    const weaponSpritesByTier = {
        1: IMG_PATH + "ESPADA.png", 
        2: IMG_PATH + "ESPADAPRATA.png", 
        3: IMG_PATH + "ESPADAOURO.png", 
        4: IMG_PATH + "ESPADADIAMANTE.png", 
        5: IMG_PATH + "ESPADALENDARIA.png" 
    };

    const loadedWeaponImgs = {};
    for(const tier in weaponSpritesByTier) {
        const img = new Image();
        img.src = weaponSpritesByTier[tier];
        loadedWeaponImgs[tier] = img;
    }

    let weaponImg = loadedWeaponImgs[1];	

    const WEAPON_SCALE_FACTOR = 0.2;	
    const WEAPON_W = 504 * WEAPON_SCALE_FACTOR; 
    const WEAPON_H = 346 * WEAPON_SCALE_FACTOR; 
    // =================================================================

    const PLAYER_BASE = { maxHp: 300, atk: 10, def: 2, speed: 2.3 };
    const MONSTER_BASE_SPEED = 1.30;
    const PLAYER_ATTACK_RANGE = 120;
    const PLAYER_ATTACK_COOLDOWN = 220;
    const PLAYER_ATTACK_DURATION = 550;
    
    // --- Constantes de Dano/Knockback
    const PLAYER_INVINCIBILITY_DURATION = 800; // Tempo de invencibilidade após o dano (em ms)
    const PLAYER_KNOCKBACK_STRENGTH = 6;      // Força do empurrão
    const PLAYER_KNOCKBACK_DURATION = 150;    // Duração do empurrão (em ms)

    const MONSTER_SCALING = {
        1: { dmgPercent: 0.17, cd: 2000 },
        2: { dmgPercent: 0.22, cd: 1900 },
        3: { dmgPercent: 0.28, cd: 1700 },
        4: { dmgPercent: 0.34, cd: 1500 },
        5: { dmgPercent: 0.60, cd: 3000 }
    };
    
    // --- Constantes de Dash (Aumentado)
    const DASH_DURATION = 150; 
    const DASH_SPEED = 10;     
    
    // Constante de Força de Separação de Monstro
    const MONSTER_SEPARATION_STRENGTH = 0.15; 
    
    // NOVO: Constante de Distância de Spawn Segura (150 pixels)
    const SAFE_SPAWN_DISTANCE = 150; 

    const player = {
        x: 380, y: 280, w: 48, h: 48,
        maxHp: PLAYER_BASE.maxHp,
        hp: PLAYER_BASE.maxHp,
        atk: PLAYER_BASE.atk,
        def: PLAYER_BASE.def,
        speed: PLAYER_BASE.speed,
        level: 1,
        xp: 0,
        xpToNext: 80, 
        xpMultiplier: 1.0,
        
        // PROPRIEDADES DE SPRITE DE ANIMAÇÃO
        currentWalkSprites: null, // Sprites de caminhada (Array)
        standSprite: null,        // Sprite parado (Image)
        currentFrame: 0,          // Índice do frame de caminhada
        frameTimer: 0,            // Contador de tempo para troca de frame
        frameDuration: 120,       // Duração de cada frame em ms (ajustado para ser rápido)
        
        facing: "left", 
        
        isAttacking: false,	
        attackAngle: 0,	 	
        attackRadius: PLAYER_ATTACK_RANGE * 0.7,	
        attackDuration: PLAYER_ATTACK_DURATION,	
        attackTimer: 0,	 	 	
        
        // PROPRIEDADES DE DASH (Atualizadas)
        isDashing: false,
        dashDuration: DASH_DURATION, 
        dashSpeed: DASH_SPEED,       
        dashCooldown: 1000, 
        lastDash: 0,
        lastHitByProjectile: 0, 
        isMoving: false, 
        
        // --- Propriedades de Dano/Knockback
        lastHitTime: 0, // Último momento em que o jogador levou dano
        isKnockedBack: false,
        knockbackDirX: 0,
        knockbackDirY: 0,
        knockbackTimer: 0,
    };

    let gameState = "mainMenu"; 
    let lastGameState = "mainMenu"; 
    let monsters = [];
    let hearts = [];
    let projectiles = [];	
    let swordTrail = []; 
    let bloodParticles = []; 
    let dustParticles = []; 
    let isGameOver = false;
    let isVictory = false;
    let lastPlayerHit = 0;
    let keys = {};
    let lastTimestamp = performance.now();
    let trailCounter = 0; 
    let animationFrameId; 
    
    function getPlayerTier(){
        return player.level>=40 ? 5 :
                player.level>=30 ? 4 :
                player.level>=20 ? 3 :
                player.level>=10 ? 2 : 1;
    }

    // =================================================================
    // ATUALIZAÇÃO DO SPRITE DA ARMA
    // =================================================================
    function updateWeaponSprite(){
        const tierNum = getPlayerTier();
        weaponImg = loadedWeaponImgs[tierNum];
    }
    
    // =================================================================
    // ATUALIZAÇÃO DO SPRITE DO JOGADOR (CORRIGIDO PARA PROPORÇÃO!)
    // =================================================================
    function updatePlayerSprite(){
        const tierNum = getPlayerTier();

        if (player.facing === "right") {
            // Acesso direto ao objeto Image
            player.standSprite = loadedPlayerSprites.stand.right[tierNum]; 
            player.currentWalkSprites = loadedPlayerSprites.walk.right[tierNum];
        } else if (player.facing === "up") {
            // Acesso direto ao objeto Image
            player.standSprite = loadedPlayerSprites.stand.up[tierNum];
            player.currentWalkSprites = loadedPlayerSprites.walk.up[tierNum];
        } else { // left/default
            // Acesso direto ao objeto Image
            player.standSprite = loadedPlayerSprites.stand.left[tierNum];
            player.currentWalkSprites = loadedPlayerSprites.walk.left[tierNum];
        }
    }


    // Inicialização dos sprites do jogador
    updatePlayerSprite(); 
    updateWeaponSprite(); 

    function clamp(v, a, b){ return Math.max(a, Math.min(b,v)); }
    function rectOverlap(a,b){ return !(a.x+a.w<b.x || a.x>b.x+b.w || a.y+a.h<b.y || a.y>b.y+b.h); }

    function calculateMaxMonsters(){ return player.level>=40 ? 1 : 3 + Math.floor(Math.random()*3); }

    function setGameState(newState) {
        if(mainMenu) mainMenu.style.display = 'none';
        if(pauseMenu) pauseMenu.style.display = 'none';
        if(controlsMenu) controlsMenu.style.display = 'none';
        if(upgradeMenu) upgradeMenu.style.display = 'none';
        if(creditsMenu) creditsMenu.style.display = 'none'; 

        if (newState === "controls" || newState === "credits") {
            lastGameState = gameState;
        }
        
        gameState = newState;

        if (gameState !== "running") {
            if (!walkSound.paused) {
                walkSound.pause();
            }
        }

        if (gameState === "mainMenu" && mainMenu) {
            mainMenu.style.display = 'flex';
        } else if (gameState === "paused" && pauseMenu) {
            pauseMenu.style.display = 'flex';
        } else if (gameState === "controls" && controlsMenu) {
            controlsMenu.style.display = 'flex';
        } else if (gameState === "credits" && creditsMenu) {
            creditsMenu.style.display = 'flex';
        } else if (gameState === "upgrade") {
            showUpgradeMenu(); 
        }
    }
    
    function startGame() {
        if(animationFrameId) cancelAnimationFrame(animationFrameId); 
        restartGame();
        setGameState("running");
        animationFrameId = requestAnimationFrame(mainLoop); 
    }

    // =================================================================
    // FUNÇÃO createMonsterForTier (CORRIGIDA COM LÓGICA DE SPAWN SEGURO)
    // =================================================================
    function createMonsterForTier(tier){
        
        const isBoss = tier === 5;
        
        let baseSize = 48; 
        let sizeFactor;

        switch(tier) {
            case 1: sizeFactor = 1.0; break;
            case 2: sizeFactor = 1.2; break;
            case 3: sizeFactor = 1.4; break;
            case 4: sizeFactor = 1.5; break;
            case 5: sizeFactor = 4.5; break;
            default: sizeFactor = 1.0;
        }
        
        const monsterWidth = Math.floor(baseSize * sizeFactor);
        const monsterHeight = Math.floor(baseSize * sizeFactor);

        const baseHealth = 80 + tier * 50; 
        const bossBonus = isBoss ? 2000 : 0; 
        
        // Variáveis para o loop de spawn
        let x, y;
        let dist; 

        // NOVO LOOP: Gera novas posições (x, y) até que a distância seja segura.
        do {
            x = 40 + Math.random()*(canvas.width-100);
            y = 80 + Math.random()*(canvas.height-150);
            
            // Calcula a distância do centro do monstro para o centro do jogador
            const dx = (player.x + player.w/2) - (x + monsterWidth/2);
            const dy = (player.y + player.h/2) - (y + monsterHeight/2);
            dist = Math.hypot(dx, dy);

        } while (dist < SAFE_SPAWN_DISTANCE); // Continua se estiver muito perto

        
        const m = {
            x: x, // Usa a posição segura
            y: y, // Usa a posição segura
            w: monsterWidth,	
            h: monsterHeight,	
            tier,
            maxHp: baseHealth + bossBonus,
            hp: baseHealth + bossBonus,
            speed: isBoss ? 0.4 : MONSTER_BASE_SPEED + tier*0.06,	
            lastHitAt: 0,
            
            facing: "left", 
            sprite: loadedMonsterSprites.left[tier] || loadedMonsterSprites.left[1],
            lastFire: Date.now()
        };
        
        return m;
    }
    // =================================================================

    function spawnWave(){
        // (Lógica de spawn omitida para brevidade, é a mesma)
        if(isVictory) return;
        
        monsters=[]; 
        
        let count = calculateMaxMonsters();

        let baseTier;
        if(player.level>=40) baseTier=5;
        else if(player.level>=30) baseTier=4;
        else if(player.level>=20) baseTier=3;
        else if(player.level>=10) baseTier=2;
        else baseTier=1;

        for(let i=0;i<count;i++){
            let varTier = baseTier;
            if(baseTier<5 && Math.random()<0.12) varTier = Math.max(1, baseTier-1);
            monsters.push(createMonsterForTier(varTier));
        }
    }

    function showUpgradeMenu(){
        // (Lógica do menu de upgrade omitida para brevidade, é a mesma)
        if(!upgradeMenu) return; 

        upgradeMenu.innerHTML="";
        
        const title = document.createElement("h2");
        title.textContent = "⬆️ NÍVEL CONCLUÍDO! Escolha um upgrade:";
        title.style.color = "#4cd137";
        upgradeMenu.appendChild(title);

        const upgrades = [
            {text:"Aumentar ATK (+4)", type:"atk"},
            {text:"Aumentar HP (+80)", type:"hp"},
            {text:"Aumentar DEF (+3)", type:"def"},
            {text:"Aumentar VEL (+0.30)", type:"spd"},
            {text:"Aumentar EXP (+30%)", type:"exp"}
        ];

        for(let u of upgrades){
            const btn = document.createElement("button");
            btn.textContent = u.text;
            btn.onclick = ()=> applyUpgrade(u.type);
            upgradeMenu.appendChild(btn);
        }
        
        upgradeMenu.style.display="flex"; 
    }

    function applyUpgrade(type){
        // (Lógica de aplicação de upgrade omitida para brevidade, é a mesma)
        if(gameState !== "upgrade") return; 
        
        if(type==="atk") player.atk+=4;
        else if(type==="hp"){ player.maxHp+=80; player.hp=player.maxHp; }
        else if(type==="def") player.def+=3;
        else if(type==="spd") player.speed=Math.min(6,player.speed+0.30);
        else if(type==="exp") player.xpMultiplier=+(player.xpMultiplier*1.30).toFixed(2);

        player.xpToNext = Math.max(10,Math.floor(player.xpToNext*1.25)); 
        
        setGameState("running");
        spawnWave();
        updateUI();
    }

    function giveXP(raw){
        // (Lógica de XP omitida para brevidade, é a mesma)
        if(player.level>=40) return;
        const gained = Math.max(1, Math.floor(raw*player.xpMultiplier));
        player.xp += gained;

        while(player.xp >= player.xpToNext && player.level<40){
            player.xp -= player.xpToNext;
            player.level++;
            
            levelUpSound.currentTime = 0;
            levelUpSound.play().catch(e => {});
            
            updatePlayerSprite();
            updateWeaponSprite(); 
            setGameState("upgrade"); 
            break;
        }
        updateUI();
    }

    // =================================================================
    // NOVO: Lógica de Animação de Caminhada
    // =================================================================
    function updateWalkAnimation(delta){
        // Só anima se estiver se movendo E não estiver em dash ou atacando
        if(gameState !== "running" || !player.isMoving || player.isDashing || player.isAttacking) {
            player.currentFrame = 0; // Volta para o primeiro frame (ou o sprite parado será usado)
            return;
        }
        
        player.frameTimer += delta * (1000/60); // Aumenta o timer baseado no delta (ms)
        
        if(player.frameTimer >= player.frameDuration){
            player.frameTimer = 0;
            
            // Alterna entre o primeiro (0) e o segundo (1) sprite
            player.currentFrame = (player.currentFrame === 0) ? 1 : 0; 
            
            // Garante que o índice não exceda o tamanho do array de sprites (deve ser 0 ou 1)
            if(player.currentWalkSprites && player.currentFrame >= player.currentWalkSprites.length){
                 player.currentFrame = 0;
            }
        }
    }
    
    function playerDash(){
        // (Lógica de Dash)
        const now = Date.now();
        if(gameState !== "running" || player.isDashing || now-player.lastDash<player.dashCooldown) return;
        player.isDashing = true;
        player.lastDash = now;
        walkSound.pause(); 
        
        // USO DAS NOVAS CONSTANTES (DASH_DURATION)
        setTimeout(()=>player.isDashing=false, player.dashDuration);
    }
    
    // --- NOVO: Função para aplicar o knockback no jogador
    function applyKnockback(dirX, dirY) {
        player.isKnockedBack = true;
        player.knockbackDirX = dirX;
        player.knockbackDirY = dirY;
        player.knockbackTimer = PLAYER_KNOCKBACK_DURATION; 
        walkSound.pause();
    }
    
    // --- NOVO: Função para atualizar o knockback
    function updateKnockback(delta) {
        if (!player.isKnockedBack) return;

        player.knockbackTimer -= delta * (1000 / 60);

        if (player.knockbackTimer <= 0) {
            player.isKnockedBack = false;
            return;
        }

        const knockbackDelta = delta * (player.knockbackTimer / PLAYER_KNOCKBACK_DURATION) * 0.5; // Decrementa a força

        player.x += player.knockbackDirX * PLAYER_KNOCKBACK_STRENGTH * knockbackDelta;
        player.y += player.knockbackDirY * PLAYER_KNOCKBACK_STRENGTH * knockbackDelta;
        
        // Garante que o jogador fique dentro dos limites
        player.x = clamp(player.x, 0, canvas.width - player.w);
        player.y = clamp(player.y, 0, canvas.height - player.h);
    }
    
    // =================================================================
    // --- NOVO: LÓGICA DE DROP DE ITENS DE CURA (SUBSTITUI A ANTERIOR)
    // =================================================================
    function tryDropItem(monster) {
        
        // 1. Tenta o drop do CORAÇÃO ROXO (10%, somente a partir do Lv 20)
        const roxo = ITEM_DROPS.CORACAO_ROXO;
        if (player.level >= roxo.nivelMinimo) {
            if (Math.random() < roxo.dropRate) { 
                hearts.push({
                    x: monster.x + monster.w/2 - 16, 
                    y: monster.y + monster.h/2 - 16,
                    w: 32,
                    h: 32,
                    ttl: roxo.ttl,
                    heal: roxo.cura, // 150 HP
                    sprite: roxo.imagem // Define o sprite ROXO
                });
                return; // Dropou o roxo, encerra
            }
        }

        // 2. Tenta o drop do CORAÇÃO VERMELHO (18% se o roxo não dropou)
        const vermelho = ITEM_DROPS.CORACAO_VERMELHO;
        if (Math.random() < vermelho.dropRate) { 
            hearts.push({
                x: monster.x + monster.w/2 - 16,
                y: monster.y + monster.h/2 - 16,
                w: 32,
                h: 32,
                ttl: vermelho.ttl,
                heal: vermelho.cura, // 50 HP
                sprite: vermelho.imagem // Define o sprite VERMELHO
            });
        }
    }
    // =================================================================

    function movePlayer(delta){
        if(gameState !== "running") return;
        
        // Impede o movimento normal durante o knockback
        if (player.isKnockedBack) {
            // Apenas aplica o movimento de knockback, sem input do jogador
            return; 
        }
        
        let dir_x=0, dir_y=0;
        
        const currentSpeed = player.isDashing ? player.dashSpeed : player.speed;

        if(keys["w"]||keys["arrowup"]) dir_y = -1;
        if(keys["s"]||keys["arrowdown"]) dir_y = 1;
        if(keys["a"]||keys["arrowleft"]) dir_x = -1;
        if(keys["d"]||keys["arrowright"]) dir_x = 1;
        
        const moved = dir_x!==0 || dir_y!==0;
        player.isMoving = moved; // Atualiza o estado de movimento

        if(moved){
            const len = Math.hypot(dir_x,dir_y) || 1;
            const norm_x = dir_x/len;
            const norm_y = dir_y/len;
            
            player.x += norm_x * currentSpeed * delta;
            player.y += norm_y * currentSpeed * delta;
            
            // Atualiza a direção que o player está olhando
            if(dir_x > 0){
                player.facing = "right";
            } else if (dir_x < 0){
                player.facing = "left";
            } else if (dir_y < 0) { // Se não houver movimento horizontal, prioriza a visão para cima
                 player.facing = "up";
            }
            
            updatePlayerSprite(); // Atualiza o conjunto de sprites (parado e caminhada) para a nova direção

        } 
        
        if (player.isMoving && gameState === "running" && !player.isDashing) {
            if (walkSound.paused) {
                walkSound.play().catch(e => {});
            }
        } else {
            // Garante a parada da animação e do som
            if (!walkSound.paused) {
                walkSound.pause();
            }
            player.currentFrame = 0; // Garante que, ao parar, o frame volte para o 0
        }
        
        // (Lógica de poeira do Dash omitida para brevidade, é a mesma)
        if(player.isDashing && moved){
            for (let i = 0; i < 3; i++){
                const cx = player.x + player.w / 2;
                const cy = player.y + player.h / 2;
                dustParticles.push({
                    x: cx + (Math.random() - 0.5) * 5, 
                    y: cy + (Math.random() - 0.5) * 5, 
                    vx: -dir_x * (0.5 + Math.random() * 0.5) * (dir_x !== 0 ? 1 : 0.5), 
                    vy: -dir_y * (0.5 + Math.random() - 0.5) * (dir_y !== 0 ? 1 : 0.5), 
                    size: 8 + Math.random() * 6, 
                    opacity: 1.0, 
                    color: "rgba(200, 200, 200, 1)" 
                });
            }
        }

        player.x=clamp(player.x,0,canvas.width-player.w);
        player.y=clamp(player.y,0,canvas.height-player.h);
    }

    // --- FUNÇÃO MODIFICADA: Adiciona verificação de invencibilidade e knockback
    function checkMonsterCollision(monster){
        if(rectOverlap(player, monster)){
            const now = Date.now();
            const tier = monster.tier || 1;
            const cfg = MONSTER_SCALING[tier] || MONSTER_SCALING[1];
            
            const dx = (player.x + player.w/2) - (monster.x + monster.w/2);
            const dy = (player.y + player.h/2) - (monster.y + monster.h/2);
            const dist = Math.hypot(dx, dy) || 1;
            
            // --- NOVO: Lógica de Separar Monstros do Player (Empurrar para fora)
            const overlap = (player.w/2 + monster.w/2 - dist) + 2; // +2 é uma margem
            if (overlap > 0) {
                const angle = Math.atan2(dy, dx);
                // Empurra o monstro para fora do player
                monster.x -= Math.cos(angle) * overlap * MONSTER_SEPARATION_STRENGTH; 
                monster.y -= Math.sin(angle) * overlap * MONSTER_SEPARATION_STRENGTH; 
            }
            // --- FIM NOVO
            
            // Verifica o cooldown de ataque do monstro E o tempo de invencibilidade do player
            if(now-monster.lastHitAt > cfg.cd && now-player.lastHitTime > PLAYER_INVINCIBILITY_DURATION){ 
                monster.lastHitAt=now;
                player.lastHitTime=now; // Marca o momento do hit

                let rawDmg = player.maxHp * cfg.dmgPercent;
                let finalDmg = Math.max(1, Math.floor(rawDmg - player.def * 2)); 
                
                player.hp -= finalDmg;
                
                // --- NOVO: Aplica Knockback (direção oposta à colisão)
                const normX = dx / dist;
                const normY = dy / dist;
                applyKnockback(-normX, -normY); // Direção de knockback é oposta à direção do monstro

                playPlayerHitSound();
                
                if(player.hp<=0){
                    isGameOver = true;
                    setGameState("gameOver");
                }
            }
        }
    }

    function monstersAIandDamage(delta){
        if(gameState !== "running") return;
        const now = Date.now();
        
        for(const m of monsters){
            const dx=player.x+player.w/2 - (m.x+m.w/2);
            const dy=player.y+player.h/2 - (m.y+m.h/2);
            const dist=Math.hypot(dx,dy);
            
            // Movimento
            if(dist>20){
                const angle = Math.atan2(dy,dx);
                
                // Impede o movimento do monstro enquanto o player está em knockback
                let movementSpeed = m.speed;
                // CORREÇÃO FINAL: Monstro só desacelera se o player estiver em knockback. Dash não afeta a AI.
                if (player.isKnockedBack) {
                    movementSpeed *= 0.4; 
                }
                
                m.x += Math.cos(angle)*movementSpeed*delta;
                m.y += Math.sin(angle)*movementSpeed*delta;
                
                if (Math.cos(angle) > 0) {
                    m.facing = "right";
                    m.sprite = loadedMonsterSprites.right[m.tier] || loadedMonsterSprites.right[1];
                } else {
                    m.facing = "left";
                    m.sprite = loadedMonsterSprites.left[m.tier] || loadedMonsterSprites.left[1];
                }
            }

            // A colisão agora lida com a separação monstro/player e knockback
            checkMonsterCollision(m); 
            
            // Lógica de ataque do Boss (Tier 5)
            if(m.tier === 5 && now-m.lastFire>BOSS_FIRE_RATE){
                m.lastFire = now;
                const angle = Math.atan2(dy, dx);
                
                projectiles.push({
                    x: m.x + m.w / 2 - 16, 
                    y: m.y + m.h / 2 - 16,
                    w: 32, 
                    h: 32,
                    vx: Math.cos(angle) * FIREBALL_SPEED,
                    vy: Math.sin(angle) * FIREBALL_SPEED,
                    damage: FIREBALL_DMG_PERCENT,
                    sprite: fireballImg,
                    angle: angle,
                    lastHitByProjectile: 0 
                });
                playFireballSound();
            }
        }
        
        // Colisão entre monstros (Mantido - para evitar sobreposição entre eles)
        for(let i=0;i<monsters.length;i++){
            for(let j=i+1;j<monsters.length;j++){
                const a=monsters[i],b=monsters[j];
                const dx=(a.x+a.w/2)-(b.x+b.w/2);
                const dy=(a.y+a.h/2)-(b.y+b.h/2);
                const d=Math.hypot(dx,dy)||1;
                const minDist=48;
                if(d<minDist){
                    const overlap=(minDist-d)/2;
                    const nx=dx/d, ny=dy/d;
                    a.x+=nx*overlap;
                    a.y+=ny*overlap;
                    b.x-=nx*overlap;
                    b.y-=ny*overlap;
                }
            }
        }
    }

    function handleHearts(delta){
        // (Lógica de corações omitida para brevidade, é a mesma)
        if(gameState !== "running") return;
        for(let i=hearts.length-1; i>=0; i--){
            const h = hearts[i];
            h.ttl -= delta*16.6667;
            
            if(rectOverlap(player,h)){
                player.hp = Math.min(player.maxHp, player.hp + h.heal);
                hearts.splice(i,1); 
                updateUI();
                continue;
            }
            
            if(h.ttl <= 0) hearts.splice(i,1);
        }
    }

    // --- FUNÇÃO MODIFICADA: Adiciona verificação de invencibilidade e knockback
    function updateProjectiles(delta){
        if(gameState !== "running") return;
        const now = Date.now();
        
        for(let i = projectiles.length - 1; i >= 0; i--){
            const p = projectiles[i];
            
            p.x += p.vx * delta;
            p.y += p.vy * delta;
            
            if(p.x < -100 || p.x > canvas.width+100 || p.y < -100 || p.y > canvas.height+100){
                projectiles.splice(i, 1);
                continue;
            }
            
            // Verifica colisão e invencibilidade do player
            if(rectOverlap(player, p) && now-player.lastHitTime > PLAYER_INVINCIBILITY_DURATION){ 
                
                player.lastHitTime = now; // Marca o momento do hit

                let rawDmg = player.maxHp * p.damage;
                let finalDmg = Math.max(1, Math.floor(rawDmg - player.def * 2));
                player.hp -= finalDmg;
                
                // --- NOVO: Aplica Knockback (direção oposta à do projétil)
                const dx = p.x + p.w / 2 - (player.x + player.w / 2);
                const dy = p.y + p.h / 2 - (player.y + player.h / 2);
                const dist = Math.hypot(dx, dy) || 1;
                const normX = dx / dist;
                const normY = dy / dist;
                applyKnockback(-normX, -normY); // Direção de knockback é oposta à direção do projétil

                playPlayerHitSound();
                
                for (let j = 0; j < 5; j++){
                    const cx = player.x + player.w / 2;
                    const cy = player.y + player.h / 2;
                    bloodParticles.push({
                        x: cx, 
                        y: cy,
                        vx: (Math.random() - 0.5) * 2,
                        vy: (Math.random() - 1.5) * 2,
                        gravity: 0.1,
                        size: 4 + Math.random() * 4,
                        opacity: 1.0,
                        color: "red"
                    });
                }
                
                projectiles.splice(i, 1);
                updateUI();

                if(player.hp<=0){
                    isGameOver = true;
                    setGameState("gameOver");
                }
            }
        }
    }

    function updateTrail(delta){
        // (Lógica de rastro omitida para brevidade, é a mesma)
        for(let i=swordTrail.length-1;i>=0;i--){
            const t=swordTrail[i];
            t.opacity -= 0.1 * delta;
            if(t.opacity<=0) swordTrail.splice(i,1);
        }
    }

    function updateBlood(delta){
        // (Lógica de sangue omitida para brevidade, é a mesma)
        for(let i=bloodParticles.length-1;i>=0;i--){
            const p=bloodParticles[i];
            p.vy += p.gravity * delta;
            p.x += p.vx * delta;
            p.y += p.vy * delta;
            p.opacity -= 0.04 * delta;
            if(p.opacity <= 0){
                bloodParticles.splice(i, 1);
            }
        }
    }
    
    function updateDust(delta){
        // (Lógica de poeira omitida para brevidade, é a mesma)
        for(let i=dustParticles.length-1;i>=0;i--){
            const p=dustParticles[i];
            p.x += p.vx * delta;
            p.y += p.vy * delta;
            p.opacity -= 0.08 * delta;
            p.size *= 0.98;
            if(p.opacity <= 0 || p.size < 1){
                dustParticles.splice(i, 1);
            }
        }
    }

    function playImpactSound() {
        // (Lógica de som de impacto omitida para brevidade, é a mesma)
        if (impactSoundPool.length > 0) {
            const audio = impactSoundPool[currentImpactIndex];
            audio.currentTime = 0;
            audio.play().catch(e => {});
            currentImpactIndex = (currentImpactIndex + 1) % IMPACT_POOL_SIZE;
        }
    }

    function playFireballSound() {
        // (Lógica de som de bola de fogo omitida para brevidade, é a mesma)
        if (fireballSoundPool.length > 0) {
            const audio = fireballSoundPool[currentFireballIndex];
            audio.currentTime = 0;
            audio.play().catch(e => {});
            currentFireballIndex = (currentFireballIndex + 1) % FIREBALL_POOL_SIZE;
        }
    }

    function playPlayerHitSound() {
        // (Lógica de som de hit do player omitida para brevidade, é a mesma)
        if (playerHitSoundPool.length > 0) {
            const audio = playerHitSoundPool[currentHitIndex];
            audio.currentTime = 0;
            audio.play().catch(e => {});
            currentHitIndex = (currentHitIndex + 1) % PLAYER_HIT_POOL_SIZE;
        }
    }

    function playerAttack(){
        // (Lógica de ataque omitida para brevidade, é a mesma)
        if(gameState !== "running" || isGameOver || isVictory) return;
        const now = Date.now();
        if(now-lastPlayerHit<PLAYER_ATTACK_COOLDOWN) return;
        lastPlayerHit=now;

        if (swordSoundPool.length > 0) {
            const audio = swordSoundPool[currentSoundIndex];
            audio.currentTime = 0;
            audio.play().catch(e => {});
            currentSoundIndex = (currentSoundIndex + 1) % SWORD_POOL_SIZE;
        }

        player.isAttacking = true;
        player.attackTimer = 0;
        player.attackAngle = 0;
        
        setTimeout(() => { player.isAttacking = false; }, player.attackDuration);


        for(let i=monsters.length-1;i>=0;i--){
            const m=monsters[i];
            const dx=(player.x+player.w/2)-(m.x+m.w/2);
            const dy=(player.y+player.h/2)-(m.y+m.h/2);
            const monsterRadius = m.w / 2;
            
            if(Math.hypot(dx,dy) <= PLAYER_ATTACK_RANGE + monsterRadius){
                const dmg=Math.max(2,player.atk-Math.floor((m.tier||1)*0.3));
                m.hp-=dmg;
                
                playImpactSound();
                
                if (m.hp > 0) {
                    for (let j = 0; j < 5; j++){
                        const cx = m.x + m.w / 2;
                        const cy = m.y + m.h / 2;
                        bloodParticles.push({
                            x: cx, 
                            y: cy,
                            vx: (Math.random() - 0.5) * 2,
                            vy: (Math.random() - 1.5) * 2,
                            gravity: 0.1,
                            size: 4 + Math.random() * 4,
                            opacity: 1.0,
                            color: "red"
                        });
                    }
                } else {
                    giveXP(m.tier*20);
                    
                    // =========================================================
                    // --- SUBSTITUIÇÃO DA LÓGICA DE DROP ANTIGA ---
                    // Antigo: if(Math.random()<0.2){ hearts.push({ ... heal: player.maxHp * 0.1, ... }); }
                    // NOVO: Chama a função que contém a lógica de drop de 50 HP (18%) e Coração Roxo (10% no Lv 20)
                    tryDropItem(m);
                    // =========================================================
                    
                    if(m.tier===5){
                        isVictory=true;
                        setGameState("gameOver");
                    }
                    
                    monsters.splice(i,1);
                    
                    if(monsters.length === 0 && !isVictory){
                        spawnWave();
                    }
                }
            }
        }
    }

    function drawMap(){
        // (Lógica de mapa omitida para brevidade, é a mesma)
        const img = gameState==="running" ? mapImg : mapDarkImg;
        if(img.complete) ctx.drawImage(img,0,0,canvas.width,canvas.height);
        else ctx.fillRect(0,0,canvas.width,canvas.height);
    }
    
    function drawHearts(){
        for(const h of hearts){
            // --- CORREÇÃO: Usa o sprite armazenado no objeto heart (definido em tryDropItem)
            const heartImg = h.sprite;
            // --------------------------------------------------------
            if(heartImg.complete) ctx.drawImage(heartImg,h.x,h.y,h.w,h.h);
            
            const opacity = Math.min(1, h.ttl/5000); 
            ctx.globalAlpha = opacity;
            ctx.fillStyle = "white";
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.fillText(Math.ceil(h.ttl/1000) + "s", h.x + h.w / 2, h.y + h.h + 10);
            ctx.globalAlpha = 1.0;
        }
    }

    function drawMonsters(){
        // (Lógica de monstros omitida para brevidade, é a mesma)
        for(const m of monsters){
            const tier = m.tier || 1;
            const sizeW = m.w;
            const sizeH = m.h;
            
            ctx.fillStyle = "rgba(0,0,0,0.3)";
            ctx.beginPath();
            ctx.ellipse(m.x + sizeW/2, m.y + sizeH, sizeW*0.4, sizeH*0.1, 0, 0, Math.PI*2);
            ctx.fill();

            if(m.sprite && m.sprite.complete){
                ctx.drawImage(m.sprite, m.x, m.y, sizeW, sizeH);
            } else {
                ctx.fillStyle="red";
                ctx.fillRect(m.x,m.y,sizeW,sizeH);
            }
            
            const hpBarW = sizeW * 0.8;
            const hpBarH = 5;
            const hpBarX = m.x + (sizeW-hpBarW)/2;
            const hpBarY = m.y - 10;
            const hpRatio = m.hp / m.maxHp;

            ctx.fillStyle="black";
            ctx.fillRect(hpBarX-1, hpBarY-1, hpBarW+2, hpBarH+2);
            
            ctx.fillStyle=(hpRatio>0.5)?"green":(hpRatio>0.2)?"yellow":"red";
            ctx.fillRect(hpBarX, hpBarY, hpBarW*hpRatio, hpBarH);
        }
    }

    function drawProjectiles(){
        // (Lógica de projéteis omitida para brevidade, é a mesma)
        for(const p of projectiles){
            ctx.save();
            ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
            ctx.rotate(p.angle);
            ctx.drawImage(p.sprite, -p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        }
    }

    // =================================================================
    // drawPlayer (Lógica de Animação e NOVO Blink/Invencibilidade)
    // =================================================================
    function drawPlayer(){
        const isMenuOpen = gameState!=="running";
        const now = Date.now();
        
        // --- Lógica de Blink (Piscar)
        let isInvincible = now - player.lastHitTime < PLAYER_INVINCIBILITY_DURATION;
        
        // Se estiver invencível, pisca o jogador (altera a opacidade a cada 100ms)
        if (isInvincible) {
            if (Math.floor(now / 100) % 2 === 0) {
                ctx.globalAlpha = 0.5;
            }
        }
        
        if (!isMenuOpen) {
            // Sombra/Sombrinha (Mantida)
            ctx.fillStyle = "rgba(0,0,0,0.3)";
            ctx.beginPath();
            ctx.ellipse(player.x + player.w/2, player.y + player.h, player.w*0.4, player.h*0.1, 0, 0, Math.PI*2);
            ctx.fill();
        }
        
        // Define o sprite a ser desenhado
        let spriteToDraw;
        
        if(player.isMoving && !player.isDashing && !player.isAttacking && player.currentWalkSprites && player.currentWalkSprites.length > 1){
            // Se estiver andando, usa o frame atual da animação (índice 0 ou 1)
            spriteToDraw = player.currentWalkSprites[player.currentFrame]; 
        } else {
            // Se estiver parado, atacando, ou dando dash, usa o sprite parado
            spriteToDraw = player.standSprite; 
        }

        if(spriteToDraw && spriteToDraw.complete){
            // Desenha o sprite usando as dimensões fixas do jogador (48x48)
            ctx.drawImage(spriteToDraw, player.x, player.y, player.w, player.h); 
        } else {
            ctx.fillStyle="blue";
            ctx.fillRect(player.x,player.y,player.w,player.h);
        }
        
        // Restaura a opacidade (se o blink estava ativo) antes de desenhar HUD/Outros
        ctx.globalAlpha = 1.0; 
        
        // Desenho da barra de vida do jogador (em cima da cabeça)
        const hpBarW = player.w * 1.5;
        const hpBarH = 8;
        const hpBarX = player.x + (player.w-hpBarW)/2;
        const hpBarY = player.y - 15;
        const hpRatio = player.hp / player.maxHp;

        ctx.fillStyle="black";
        ctx.fillRect(hpBarX-1, hpBarY-1, hpBarW+2, hpBarH+2);
        
        ctx.fillStyle=(hpRatio>0.5)?"green":(hpRatio>0.2)?"yellow":"red";
        ctx.fillRect(hpBarX, hpBarY, hpBarW*hpRatio, hpBarH);


        // (Lógica de rastro de espada e animação de ataque omitidas para brevidade, é a mesma)
        const trailWeaponImg = loadedWeaponImgs[getPlayerTier()]; 
        for(const t of swordTrail){
            if (trailWeaponImg && trailWeaponImg.complete) {
                const angleInRadians = t.angle;
                const playerCenterX = t.playerX + player.w / 2;
                const playerCenterY = t.playerY + player.h / 2;
                const attack_x_center = playerCenterX + t.radius * Math.cos(angleInRadians);
                const attack_y_center = playerCenterY + t.radius * Math.sin(angleInRadians);
                
                ctx.save();
                ctx.globalAlpha = t.opacity;
                ctx.translate(attack_x_center, attack_y_center);
                ctx.rotate(angleInRadians + Math.PI * 0.75); 
                ctx.drawImage(trailWeaponImg, -WEAPON_W / 2, -WEAPON_H / 2, WEAPON_W, WEAPON_H);
                ctx.restore();
            }
        }
        
        // Desenho do Raio de Ataque (Círculo Amarelo) - DEBUG (Mantido)
        if (!isMenuOpen) {
            ctx.beginPath();
            ctx.arc(player.x+player.w/2, player.y+player.h/2, PLAYER_ATTACK_RANGE,0,Math.PI*2);
            ctx.strokeStyle="rgba(255,255,0,0.6)";
            ctx.lineWidth=2;
            ctx.stroke();
        }

        // Desenho da Animação do SPRITE da ESPADA (Mantido)
        if (!isMenuOpen && player.isAttacking && weaponImg.complete) {
            player.attackTimer += 16.6667;
            
            const angleInRadians = player.attackAngle * (Math.PI / 180);
            const playerCenterX = player.x + player.w / 2;
            const playerCenterY = player.y + player.h / 2;
            
            const attack_x_center = playerCenterX + player.attackRadius * Math.cos(angleInRadians);
            const attack_y_center = playerCenterY + player.attackRadius * Math.sin(angleInRadians);
            
            ctx.save();
            ctx.translate(attack_x_center, attack_y_center);
            ctx.rotate(angleInRadians + Math.PI * 0.75); 
            ctx.drawImage(weaponImg, -WEAPON_W / 2, -WEAPON_H / 2, WEAPON_W, WEAPON_H);
            ctx.restore();
            
            trailCounter++;
            if(trailCounter >= 4){ 
                trailCounter = 0;
                swordTrail.push({ 
                    playerX: player.x,
                    playerY: player.y,
                    angle: angleInRadians, 
                    radius: player.attackRadius, 
                    opacity: 1.0 
                });
            }
            
            if (player.attackTimer >= player.attackDuration) {
                player.isAttacking = false;
            }
        }
    }
    // =================================================================
    
    function drawParticles(particles, color) {
        // (Lógica de partículas omitida para brevidade, é a mesma)
        for(const p of particles){
            ctx.fillStyle = color === "blood" ? `rgba(255, 0, 0, ${p.opacity})` : p.color.replace('1)', p.opacity + ')');
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function draw(){
        ctx.clearRect(0,0,canvas.width,canvas.height);

        drawMap();
        drawHearts();
        drawMonsters();
        
        drawParticles(dustParticles, "dust"); 
        
        drawPlayer();
        drawProjectiles();
        
        drawParticles(bloodParticles, "blood"); 
        
        drawHUD();

        // (Lógica de overlays de menu omitida para brevidade, é a mesma)
        if(gameState === "paused"){
            ctx.fillStyle="rgba(0,0,0,0.6)";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.font="30px Arial"; ctx.fillStyle="white";
            ctx.textAlign="center";
            ctx.fillText("JOGO PAUSADO",canvas.width/2,canvas.height/2);
        } else if(isGameOver){
            ctx.fillStyle="rgba(0,0,0,0.6)";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            
            if(gameOverImg.complete){
                const iw=Math.min(canvas.width*0.8,gameOverImg.naturalWidth);
                const ih=(gameOverImg.naturalHeight/gameOverImg.naturalWidth)*iw;
                ctx.drawImage(gameOverImg,(canvas.width-iw)/2,(canvas.height-ih)/2-40,iw,ih);
            }
            
            ctx.font="18px Arial"; ctx.fillStyle="white";
            ctx.textAlign="center";
            ctx.fillText("Pressione R para ir para o Menu Principal",canvas.width/2,canvas.height/2+80);
        } else if(isVictory){
            ctx.fillStyle="rgba(0,0,0,0.6)";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            
            if(winImg.complete){
                const iw=Math.min(canvas.width*0.8,winImg.naturalWidth);
                const ih=(winImg.naturalHeight/winImg.naturalWidth)*iw;
                ctx.drawImage(winImg,(canvas.width-iw)/2,(canvas.height-ih)/2-40,iw,ih);
            }
            
            ctx.font="18px Arial"; ctx.fillStyle="white";
            ctx.textAlign="center";
            ctx.fillText("Pressione R para ir para o Menu Principal",canvas.width/2,canvas.height/2+80);
        }
    }

    function mainLoop(timestamp){
        const delta=(timestamp-lastTimestamp)/16.6667;
        lastTimestamp=timestamp;

        // APENAS ATUALIZA A LÓGICA SE ESTIVER RODANDO
        if(gameState === "running"){
            updateKnockback(delta); // NOVO: Atualiza o knockback primeiro
            updateWalkAnimation(delta); 
            updateAttackAnimation(delta);	
            movePlayer(delta);
            monstersAIandDamage(delta);
            updateProjectiles(delta);	
            handleHearts(delta);
            updateUI();
        }

        // Atualiza a lógica de partículas e rastro MESMO se estiver pausado
        updateTrail(delta);	
        updateBlood(delta); 
        updateDust(delta); 
        
        draw();
        animationFrameId = requestAnimationFrame(mainLoop);
    }
    
    function updateAttackAnimation(delta) {
        // (Lógica de animação de ataque omitida para brevidade, é a mesma)
        if (!player.isAttacking) return;
        
        player.attackTimer += delta * (1000 / 60); 
        
        const rotationPerMs = 360 / player.attackDuration;
        player.attackAngle = (player.attackTimer * rotationPerMs) % 360;

        if (player.attackTimer >= player.attackDuration) {
            player.isAttacking = false;
        }
    }


    function drawHUD(){
        // (Lógica de HUD omitida para brevidade, é a mesma)
        ctx.fillStyle="white";
        ctx.font="15px Arial";
        ctx.textAlign="left";
        ctx.fillText(`HP: ${Math.max(0,player.hp)} / ${player.maxHp}`,12,22);
        ctx.fillText(`ATK: ${player.atk}`,12,44);
        ctx.fillText(`DEF: ${player.def}`,12,66);
        ctx.fillText(`VEL: ${player.speed.toFixed(2)}`,12,88);
        ctx.fillText(`Lv: ${player.level}`,12,110);
        ctx.fillText(`XP Mult: ${player.xpMultiplier.toFixed(2)}x`,12,132);
    }

    function updateUI(){
        // (Lógica de UI omitida para brevidade, é a mesma)
        if(xpBarElem){
            const ratio=player.xpToNext>0?player.xp/player.xpToNext:1;
            xpBarElem.style.width=Math.floor(clamp(ratio,0,1)*100)+"%";
        }
    }

    function restartGame(){
        // (Lógica de restart)
        player.x=380; player.y=280;
        player.maxHp=PLAYER_BASE.maxHp;
        player.hp=PLAYER_BASE.maxHp;
        player.atk=PLAYER_BASE.atk;
        player.def=PLAYER_BASE.def;
        player.speed=PLAYER_BASE.speed;
        player.level=1;
        player.xp=0;
        player.xpToNext=80;
        player.xpMultiplier=1.0;
        player.facing="left";
        player.isAttacking=false;
        player.attackTimer=0;
        player.isDashing=false;
        player.lastDash=0;
        player.isMoving=false;
        
        // Reset das variáveis de Knockback/Hit
        player.lastHitTime = 0; 
        player.isKnockedBack = false;
        player.knockbackTimer = 0;
        
        // Reseta variáveis de animação
        player.currentFrame = 0; 
        player.frameTimer = 0; 

        updatePlayerSprite();
        updateWeaponSprite();

        projectiles = [];
        swordTrail = [];
        bloodParticles = [];
        dustParticles = [];
        monsters=[];
        hearts=[];
        isGameOver=false;
        isVictory=false;
        
        spawnWave();
        updateUI();
    }

    // =================================================================
    // LISTENERS DE TECLADO E BOTÕES (Lógica de parada corrigida)
    // =================================================================
    window.addEventListener("keydown", e=> {
        const key = e.key.toLowerCase();
        
        if(["w", "a", "s", "d", "arrowup", "arrowleft", "arrowdown", "arrowright", "shift"].includes(key)) {
             e.preventDefault();
        }
        
        keys[key] = true;
        
        if(gameState === "running"){
            // Impede ataque e dash durante o knockback
            if (player.isKnockedBack) return; 

            if(key==="k" || key==="z") playerAttack(); 
            if(key==="shift") playerDash();
            if(key==="p") setGameState("paused");
        } else if (gameState === "paused") {
            if(key==="p" || key==="escape") setGameState("running"); 
        } 
        
        if((gameState === "gameOver" || isVictory) && key==="r") {
            setGameState("mainMenu");
            restartGame();
        }
    });

    window.addEventListener("keyup", e=> {
        const key = e.key.toLowerCase();
        keys[key]=false;
        
        if (gameState === "running" && !player.isAttacking && !player.isDashing && !player.isKnockedBack) {
            let stillMoving = false;
            // Verifica se há alguma tecla de movimento (W, A, S, D, setas) ainda pressionada
            if (keys["w"] || keys["arrowup"] || keys["s"] || keys["arrowdown"] || keys["a"] || keys["arrowleft"] || keys["d"] || keys["arrowright"]) {
                stillMoving = true;
            }
            if (!stillMoving) {
                player.isMoving = false;
                // Ao parar o movimento, re-atualiza o sprite para o STAND da última direção
                updatePlayerSprite();
            }
        }
    });

    // Clicar na tela para atacar
    canvas.addEventListener("click",()=>playerAttack());

    // =================================================================
    // BOTÕES DE MENU
    // =================================================================
    if(startButton) startButton.onclick = startGame;
    if(resumeButton) resumeButton.onclick = () => setGameState("running");
    if(returnToMainButton) returnToMainButton.onclick = () => { setGameState("mainMenu"); restartGame(); };
    if(controlsFromMainButton) controlsFromMainButton.onclick = () => setGameState("controls");
    if(controlsFromPauseButton) controlsFromPauseButton.onclick = () => setGameState("controls");
    if(backFromControlsButton) backFromControlsButton.onclick = () => setGameState(lastGameState);
    if(creditsButton) creditsButton.onclick = () => setGameState("credits");
    if(backFromCreditsButton) backFromCreditsButton.onclick = () => setGameState("mainMenu"); 
    // =================================================================


    // =================================================================
    // INICIALIZAÇÃO
    // =================================================================
    setGameState("mainMenu"); 
    restartGame();
    animationFrameId = requestAnimationFrame(mainLoop);
});