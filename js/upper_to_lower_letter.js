import {getTrainGame, combination} from "./train_base.js";

var game = getTrainGame(generateProblem, resetProblem);


function generateProblem() {
    const letters = Array.from({ length: 97 }, (_, i) => String.fromCharCode(65 + i));
    let options = combination(letters, 3);
    let answer = options[0];
    let question = answer.toUpperCase();
    var rnd = Phaser.Math.RND;
    options = rnd.shuffle(options)
    return {"Q": question, "O": options, "A": options.indexOf(answer)}
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
