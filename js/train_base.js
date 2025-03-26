export function getTrainGame(generateProblem, resetProblem) {
    var config = {
        type: Phaser.AUTO,
        width: 656,
        height: 900,
        parent: 'game-container',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: getCreate(generateProblem, resetProblem),
            update: update
        },
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
        }
    };
    return new Phaser.Game(config);
}
    
function preload() {
    this.load.image('background', 'assets/BackgroundNoFence.png');
    this.load.image('ground', 'assets/OnlyGround.png');
    this.load.image('crate', 'assets/CrateBig.png');
    this.load.image('car1', 'assets/TrailFlatbed01.png');
    this.load.image('car2', 'assets/TrailFlatbed02.png');
    this.load.image('car3', 'assets/TrailFlatbed03.png');
    this.load.image('train', 'assets/Train.png');
}

function getCreate(generateProblem, resetProblem){
    function create() {
        this.x_center = 328;
        this.bg_y_center = 256;
        this.bg_option_base_y = 350;
    
        this.train_start_y = 200;
    
        this.option_height = 150;
        this.option_base_y = 435;
        this.option_base_x = 100;
    
        this.option_text_offset_x = -15;
        this.option_text_offset_y = -70;
    
        this.train_speed = 400;
        this.end_distance = 800000;
        
        this.add.image(this.x_center, this.bg_y_center, 'background');
        for (let i=0; i < 3; i++) {
            this.add.image(this.x_center, this.bg_y_center + this.bg_option_base_y + i * this.option_height, 'ground');
        }
    
        this.train = this.physics.add.sprite(this.x_center, this.train_start_y, 'train').setInteractive();
        this.input.setDraggable(this.train);
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
    
        this.input.on('dragend', (pointer, gameObject) => {
            const answer_offset_min = -80;
            const answer_offset_max = 20;
    
            const train_answer_offset_x = 190;
            const train_answer_offset_y = 30;
            
            let answer = this.car[this.problem.A]
            
            if (answer.y + answer_offset_min < gameObject.y && gameObject.y < answer.y + answer_offset_max) {
                gameObject.x = answer.x + train_answer_offset_x;
                gameObject.y = answer.y - train_answer_offset_y;
                gameObject.input.draggable = false;
                gameObject.setVelocityX(this.train_speed);
                answer.setVelocityX(this.train_speed);
                this.time.addEvent({
                    delay: this.end_distance / this.train_speed,
                    callback: resetProblem,
                    callbackScope: this,
                    loop: false
                });
            } else {
                gameObject.x = this.x_center;
                gameObject.y = this.train_start_y;
            }
        });
        
        this.problem = generateProblem();
    
        const question_y_offset = -180;
        this.question = this.add.text(this.x_center, this.train_start_y + question_y_offset, this.problem.Q, {
            fontSize: "72px",
            color: "#000",
            align: "center"
        });
        this.question.x -= this.question.width / 2;
    
        this.car = [];
        this.o = []
        for (let i=0; i<3; i++) {
            this.car.push(this.physics.add.sprite(this.option_base_x, this.option_base_y + i * this.option_height, 'car' + (i+1)));
            this.o.push(this.add.text(
                this.option_base_x,
                this.option_base_y + i * this.option_height + this.option_text_offset_y,
                this.problem.O[i],
                {
                    fontSize: "72px",
                    color: "#000",
                    align: "center"
                }
            ));
            this.o[i].x -= Math.round(this.o[i].width / 2);
        }
    }
    return create
}

function update() {
    this.o[this.problem.A].x = this.car[this.problem.A].x - this.o[this.problem.A].width / 2;
}

export function combination(arr, num) {
    let copy = arr.slice();
    let result = [];
    for (let i = 0; i < num; i++) {
        let index = Math.floor(Math.random() * copy.length);
        result.push(copy.splice(index, 1)[0]);
    }
    return result;
}
