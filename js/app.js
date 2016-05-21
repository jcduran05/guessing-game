var model = {
    init: function() {
        model.winningNumber = model.generateWinningNumber();
        // console.log(model.winningNumber);
        model.playersGuess = 0;
        model.playersGuesses = model.generatePlayersGuesses();
        model.remainingGuesses = model.generateRemainingGuess();
        model.hintFlag = 0;
    },

    generateWinningNumber: function() {
        return Math.floor((Math.random() * 100) + 1);;
    },

    generateRemainingGuess: function() { 
        return 5; 
    },

    generatePlayersGuesses: function() { 
        return []; 
    },
};

var viewModel = {
    getCurrentWinningNumber: function() {
        return model.winningNumber;
    },

    getPlayersGuess: function() {
        return model.playersGuess;
    },

    getPlayersGuesses: function() {
        return model.playersGuesses;
    },

    getRemainingGuesses: function() {
        return model.remainingGuesses;
    },

    setPlayersGuess: function(num) {
        var parsedNum = parseInt(num);
        model.playersGuess = parsedNum;
        model.playersGuesses.push(parsedNum);
    },

    lowerRemainingGuesses: function() {
        model.remainingGuesses -= 1;
    },

    checkPlayersGuess: function() {
        return viewModel.getPlayersGuess() === viewModel.getCurrentWinningNumber();
    },

    init: function() {
        // Get basic model data
        model.init();
        // Init all the views
        guessSubmittedView.init();
        hintView.init();
        remainingGuessesView.init();
        playAgainBtnView.init();
        hintBntView.init();
        // boxesView.init();
    }
};

var guessSubmittedView = {
    init: function() {
        var submitEvent = $("#submit-guess");
        this.guessInput = $('#guess-input');
        // Event when enter key is pressed
        this.guessInput.on("keydown", function (e) {
            if (e.keyCode == 13) {
                event.preventDefault();
                guessSubmittedView.submitClick();
            }
        });

        // Event when submit button is clicked
        $("#submit-guess").on("click", guessSubmittedView.submitClick);
    },

    submitClick: function() {
            // Get the submitted value
            this.guessInput = $('#guess-input');
            var submittedValue = this.guessInput.val();
            // Set players guess and update remaining tries
            viewModel.setPlayersGuess(submittedValue);
            viewModel.lowerRemainingGuesses();
            guessSubmittedView.render();
            boxesView.update();
            this.guessInput.val('');
    },

    render: function() {
            remainingGuessesView.render();

            var playersGuessBool = viewModel.checkPlayersGuess(viewModel.getPlayersGuess());
            if (playersGuessBool) {
                $("#hint").html('You Are CORRECT!');
                disable.on();
            } else {
                hintView.render();
            }
    }
};

var hintView = {
    init: function() {
        this.remainingGuessesTag = $("#hint");
        this.remainingGuessesTag.html('');
    },

    render: function() {
        var winningNumber = viewModel.getCurrentWinningNumber();
        var playersGuess = viewModel.getPlayersGuess();
        var playersGuesses = viewModel.getPlayersGuesses();
        var difference = Math.abs(playersGuess - winningNumber);
        var remainingGuessesTag = $("#hint");
        console.log(playersGuess);
        console.log(playersGuesses);

        var count = 0
        playersGuesses.forEach(function(num) {
            if (playersGuess === num) count++;
            if (count > 1) { 
                remainingGuessesTag.html('You already picked that number');
            } else {
                if (difference === 1) remainingGuessesTag.html('You are super hot');
                if (difference > 1 && difference < 3) remainingGuessesTag.html('You are hot');
                if (difference > 3) remainingGuessesTag.html('You are cold');
            }
        })
    }
};

var remainingGuessesView = {
    init: function() {
        var remainingGuesses = viewModel.getRemainingGuesses();

        // Remaining guesses
        this.remainingGuessesTag = $("#remaining-guesses");
        this.remainingGuessesTag.html(remainingGuesses + " Guesses Remaining");

        // Progress bar
        this.progressTag = $("#progress");
        this.progressTag.html('<div class="progress-bar" style="width: 100%;"></div>');
    },

    render: function() {
        var remainingGuesses = viewModel.getRemainingGuesses();
        var progressWidth = (remainingGuesses / 5) * 100;
        if (progressWidth < 0) progressWidth = 0;

        this.progressTag.html('<div class="progress-bar" style="width: '+ progressWidth +'%;"></div>');
        if (remainingGuesses > 1) {
            this.remainingGuessesTag.html(remainingGuesses + " Guesses Remaining");
        } else if (remainingGuesses === 1) {
            this.remainingGuessesTag.html(remainingGuesses + " Guess Remaining");
        } else {
            disable.on();
            this.remainingGuessesTag.html("Sorry, Play Again!");
        }
    }
};

var hintBntView = {
    init: function() {
        $("#hint-btn").click(hintBntView.hintClick);
    },

    hintClick: function() {
        hintBntView.render();
    },

    render: function() {
        //if guesses > 1 give hint 
        if (viewModel.getPlayersGuesses().length > 0) {
            $("#hint").html('The winning number is ' + viewModel.getCurrentWinningNumber());
        }
        // else dont
    }
};

var playAgainBtnView = {
    init: function() {
        $("#play-again-btn").click(playAgainBtnView.playAgainClick);
    },

    playAgainClick: function() {
        playAgainBtnView.render();
    },

    render: function() {
        disable.off();
        location.reload()
    }
};

var boxesView = {
    init: function() {
        this.boxesDiv = $("#number-boxes");
        this.boxesDiv.html('');
        boxesView.render();

        for (var i = 1; i <= 100; i++) {
            $('#number-box-' + i).on("click", function (e) {
                $('#guess-input').val($(this).html());
                guessSubmittedView.submitClick();
            });
        }
    },

    render: function() {
        var html = '';

        for (var i = 1; i <= 100; i++) {
            // if num is one from players guesses,  
            html += '<div id="number-box-' + i + '"class="col-sm-1 number-box">' + i + '</div>\n';
        }

        this.boxesDiv.append(html);
    },

    update: function() {
        var playersGuess = viewModel.getPlayersGuess();

        $('#number-box-' + playersGuess).addClass("number-box-selected");
        $('#number-box-' + playersGuess).removeClass("number-box");
        $('#number-box-' + playersGuess).unbind("click");
        // $('#number-box-' + playersGuess).prop('disabled', true);
    },
};

var disable = {
    on: function() {
        $("#guess-input").attr('disabled', true);
        $("#submit-guess").attr('disabled', true);
        $("#hint-btn").attr('disabled', true);

        // $("#guess-input").unbind("keydown");
        for (var i = 1; i <= 100; i++) {
            $('#number-box-' + i).unbind("click");
        }
    },

    off: function() {
        $("#guess-input").attr('disabled', false);
        $("#submit-guess").attr('disabled', false);
        $("#hint-btn").attr('disabled', false);
    }
};

viewModel.init();

// Code to animate character
$(document).ready(function(){
  animateRobber();
});


function animateRobber() {
  $("#robber").animate({'margin-top': '-=25px'}, 1800, animateRobber);
  $("#robber").animate({'margin-top': '+=25px'}, 1800, animateRobber);
}