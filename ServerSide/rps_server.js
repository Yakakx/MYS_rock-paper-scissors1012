var greedy_threshould = 0.2; 		// epsilon greedy policy, to trade off between 'exploitation' and 'exploration'
var queue_length = 20; 	// change this number to have less or more attempts

var play_history = {}; // an empty JS object, later it's going to store the move of human in queue, length = 20
var play_history_length = {}; // queue simulate length
var player_history_index = {}; // queue simulate index (cycle)
var total_game_played = {};
var human_win = {};
var ai_win = {};

var moves = ['Scissor', 'Paper', 'Rock'];

var express = require('express');
var app = express();

app.post('/post', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    console.log("New express client");
    console.log("Received: ");
    console.log(JSON.parse(req.query['data']));
    var z = JSON.parse(req.query['data']);

    // check if the request action is startGame
    if (z['action'] === 'startGame') {

        var jsontext;
        var nameID = z['name'];
        play_history[nameID] = [];
        play_history_length[nameID] = 0;
        player_history_index[nameID] = 0;
        total_game_played[nameID] = 0;
        human_win[nameID] = 0;
        ai_win[nameID] = 0;
        jsontext = JSON.stringify({
            'action': 'generateCode',
            'nameID': nameID,
            'msg': 'New code generated!!!'
        });
        console.log(jsontext);
        console.log(codes);
        // send the response while including the JSON text
        res.send(jsontext)
    } else if (z['action'] === "evaluate") {

        //generate AI move according to player's history.
        var move = generateMove(z['name']);
        var [human_move, ai_move, result]
            = evaluate(z['move'], move);

        collect(human_move, ai_move, result, z['name']);
        /* the response will have 7 parts: request action, whether win or not, move of human player,
        move of ai, number of human win, number of ai win, and total game played */
        jsontext = JSON.stringify({
            'action': 'evaluate',
            'win': result,
            'human_move': human_move,
            'ai_move': ai_move,
            'human_win': human_win[z['name']],
            'ai_win': ai_win[[z['name']]],
            'total_game_played': total_game_played[z['name']]
        });
        console.log(jsontext);
        res.send(jsontext);
    } else {
        res.send(JSON.stringify({ 'msg': 'error!!!' }));
    }
}).listen(3000);
console.log("Server is running!");

/*
 * Evaluate the client's move
 * @param human_move is the move input from human in ['Scissor', 'Paper', 'Rock']
 * @param ai_move is the move input from ai in ['Scissor', 'Paper', 'Rock']
 * @return human_move, ai_move, win or lose or tie (from perspective of human)
 */
function evaluate(human_move, ai_move) {

    var result;
    //calculate the result
    if (human_move === 'Rock' && ai_move === "Scissor")
        result = 'win';
    if (human_move === 'Rock' && ai_move === "Paper")
        result = 'lose';
    if (human_move === 'Rock' && ai_move === "Rock")
        result = 'tie';

    if (human_move === 'Scissor' && ai_move === "Scissor")
        result = 'tie';
    if (human_move === 'Scissor' && ai_move === "Paper")
        result = 'win';
    if (human_move === 'Scissor' && ai_move === "Rock")
        result = 'lose';

    if (human_move === 'Paper' && ai_move === "Scissor")
        result = 'lose';
    if (human_move === 'Paper' && ai_move === "Paper")
        result = 'tie';
    if (human_move === 'Paper' && ai_move === "Rock")
        result = 'win';

    return [human_move, ai_move, result];
}

/*
 * Generate a Move for next turn.
 * @param clientName is this client name
 * It's inspired Naive Bayes, P(A|S) means the next action that human may move.
 * P(A|S)=P(S|A)P(A)/P(S), S=(last_action_human, last_action_ai, win_or_lose), A in {Scissor, Rock, Paper}
 * So, we have P(A|S) = P(last_acton_human|A) * P(last_action_ai|A) * P(win_or_lose|A) * P(A)
 * Thus, we calculating P(Scissor|S), P(Rock|S) and P(Paper|S), pick the move with highest probability.
 * Furthermore, policy above is a greedy policy. We need some randomness to incorporate uncertain, and ability
 * of exploration. Thus we will using epsilon-greedy policy, instead.
 * return a move in ['Rock', 'Paper', 'Scissor']
 */
function generateMove(clientName) {

    var epsilon = Math.random();
    var length = play_history_length[name];
    var history = play_history[name];
    var index = player_history_index[name] - 1;

    // explore a random move with 20% chance, or not play for more than 3 games
    if (epsilon < greedy_threshould || length < 4){
        return moves[Math.floor(Math.random() * 3)];
    }

    // simply +1 to avoid divide 0
    var total = total_game_played[clientName] + 1;

    var scissor = 1;
    var paper = 1;
    var rock = 1;

    var human_scissor_scissor = 1;
    var human_scissor_rock = 1;
    var human_scissor_paper = 1;

    var human_paper_scissor = 1;
    var human_paper_rock = 1;
    var human_paper_paper = 1;

    var human_rock_scissor = 1;
    var human_rock_rock = 1;
    var human_rock_paper = 1;

    var ai_scissor_scissor = 1;
    var ai_scissor_rock = 1;
    var ai_scissor_paper = 1;

    var ai_paper_scissor = 1;
    var ai_paper_rock = 1;
    var ai_paper_paper = 1;

    var ai_rock_scissor = 1;
    var ai_rock_rock = 1;
    var ai_rock_paper = 1;

    var scisser_win = 1;
    var rock_win = 1;
    var paper_win = 1;

    // check history
    for (let i=1; i < length; i++){
        var [last_human_move, last_ai_move, last_result] = history[i-1];
        var current_human_move = history[i][0];

        if (current_human_move === 'Scissor'){
            if (last_human_move === 'Scissor')
                human_scissor_scissor += 1;
            if (last_human_move === 'Paper')
                human_paper_scissor += 1;
            if (last_human_move === 'Rock')
                human_rock_scissor += 1;

            if (last_ai_move === 'Scissor')
                ai_scissor_scissor += 1;
            if (last_ai_move === 'Paper')
                ai_paper_scissor += 1;
            if (last_ai_move === 'Rock')
                ai_rock_scissor += 1;
            scissor += 1;
            if (history[i] === 'win')
                scisser_win += 1;
        }

        if (current_human_move === 'Paper'){
            if (last_human_move === 'Scissor')
                human_scissor_paper += 1;
            if (last_human_move === 'Paper')
                human_paper_paper += 1;
            if (last_human_move === 'Rock')
                human_rock_paper += 1;

            if (last_ai_move === 'Scissor')
                ai_scissor_paper += 1;
            if (last_ai_move === 'Paper')
                ai_paper_paper += 1;
            if (last_ai_move === 'Rock')
                ai_rock_paper += 1;
            paper += 1;
            if (history[i] === 'win')
                paper_win += 1;
        }

        if (current_human_move === 'Rock'){
            if (last_human_move === 'Scissor')
                human_scissor_rock += 1;
            if (last_human_move === 'Paper')
                human_paper_rock += 1;
            if (last_human_move === 'Rock')
                human_rock_rock += 1;

            if (last_ai_move === 'Scissor')
                ai_scissor_rock += 1;
            if (last_ai_move === 'Paper')
                ai_paper_rock += 1;
            if (last_ai_move === 'Rock')
                ai_rock_rock += 1;
            rock += 1;
            if (history[i] === 'win')
                rock_win += 1;
        }
    }

    // calculating probability, consider s = last three games, with different weight 1, 2, 3
    var last_state = [];
    last_state[0] = history[index];
    last_state[1] = history[(index - 1 + length) % length];
    last_state[2] = history[(index - 2 + length) % length];

    var p_scissor = 1;
    var p_rock = 1;
    var p_paper = 1;

    for (let i=0; i<3; i++){
        var weight = 3-i;
        var state = last_state[i];

        if (state[0] === 'Scissor'){
            p_scissor += weight * Math.log(human_scissor_scissor / total);
            p_rock += weight * Math.log(human_scissor_rock / total);
            p_paper += weight * Math.log(human_scissor_paper / total);
        }

        if (state[0] === 'Paper'){
            p_scissor += weight * Math.log(human_paper_scissor / total);
            p_rock += weight * Math.log(human_paper_rock / total);
            p_paper += weight * Math.log(human_paper_paper / total);
        }

        if (state[0] === 'Rock'){
            p_scissor += weight * Math.log(human_rock_scissor / total);
            p_rock += weight * Math.log(human_rock_rock / total);
            p_paper += weight * Math.log(human_rock_paper / total);
        }
        if (state[1] === 'Scissor'){
            p_scissor += weight * Math.log(ai_scissor_scissor / total);
            p_rock += weight * Math.log(ai_scissor_rock / total);
            p_paper += weight * Math.log(ai_scissor_paper / total);
        }

        if (state[1] === 'Paper'){
            p_scissor += weight * Math.log(ai_paper_scissor / total);
            p_rock += weight * Math.log(ai_paper_rock / total);
            p_paper += weight * Math.log(ai_paper_paper / total);
        }

        if (state[1] === 'Rock'){
            p_scissor += weight * Math.log(ai_rock_scissor / total);
            p_rock += weight * Math.log(ai_rock_rock / total);
            p_paper += weight * Math.log(ai_rock_paper / total);
        }

    }

    var move = 'Rock';
    if (p_scissor > p_rock)
        move = 'Scissor';
    if (p_paper > p_scissor)
        move = 'Paper';

    return move;

}

function collect(human_move, ai_move, result, name) {

    var length = play_history_length[name];
    var index = player_history_index[name];

    if (length < queue_length){
        play_history[name].append([human_move, ai_move, result]);
        play_history_length[name] += 1;
        player_history_index[name] += 1;
    }
    else {
        play_history[name][index % 20] = [human_move, ai_move, result];
        player_history_index[name] += 1;
        if (player_history_index[name] > queue_length)
            player_history_index[name] = 1;
    }
}