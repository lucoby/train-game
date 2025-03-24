import {getTrainGame, combination} from "./train_base.js";

var game = getTrainGame(generateProblem, resetProblem);


function generateProblem() {
    let a = Phaser.Math.Between(1, 5);
    let b = Phaser.Math.Between(1, 5);

    let question = "" + a + "+" + b;
    let answer = a + b;
    let options = [answer];

    for (let i = 0; i < 2; i++) {
        options.push(getUniqueRandom(1, 10, options))
    }

    var rnd = Phaser.Math.RND;
    options = rnd.shuffle(options)
    return {"Q": question, "O": options, "A": options.indexOf(answer)}
}

function getUniqueRandom(min, max, excludedList) {
    let randomNumber;
    do {
        randomNumber = Phaser.Math.Between(min, max);  // Generate random number
    } while (excludedList.includes(randomNumber));  // Check if it's in the excluded list
    return randomNumber;
}

function resetProblem() {
    this.train.setVelocityX(0);
    this.car[this.problem.A].setVelocityX(0);
    this.problem = generateProblem();
    this.train.x = this.x_center;
    this.train.y = this.train_start_y;
    this.train.input.draggable = true;
    this.question.setText(this.problem.Q)
    for (let i=0; i<3; i++) {
        this.car[i].x = this.option_base_x;
        this.car[i].y = this.option_base_y + i * this.option_height;
        this.o[i].setText(this.problem.O[i]);
        this.o[i].x = this.option_base_x - this.o[i].width / 2;
        this.o[i].y = this.option_base_y + i * this.option_height + this.option_text_offset_y;
    }
}
