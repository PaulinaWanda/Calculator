$(document).ready(function() {
    /*arithmetical operations*/
    function add(prev, next) {
        return prev + next;
    }

    function substract(prev, next) {
        return prev - next;
    }

    function multiply(prev, next) {
        return prev * next;
    }

    function divide(prev, next) {
        return prev / next;
    }

    function percent(prev) {
        return prev / 100;
    }

    function reverse(prev) {
        return prev * (-1);
    }

    function power(prev, next) {
        return Math.pow(prev, next);
    }

    function root(prev, next) {
        return Math.pow(prev, 1 / next);
    }
    /*DOM elements*/
    var $button = $("button");
    var $currentCalc = $("#current-calc");
    var $wholeCalc = $("#whole-calc");
    var $point = $("#point");
    var $percentSymbol = $("#percent-symbol");
    var $reverseSigns = $("#reverse-signs");
    var $equalSymbol = $("#equal-symbol");
    var $ac = $("#ac");

    /*variables for data storage*/
    var prev = 0;
    var next = 0;
    var operator = "";
    var equals = 0;

    /*regular expressions, constants*/
    var thePoint = /\./;
    var maxLength = 9;

    /*onclick function*/
    $button.on("click", function() {

        /*on numbers*/
        if ($(this).hasClass("num")) {
            /*prevent from starting with 0*/
            if (!$currentCalc.text() && ($(this).text() === "0" || $(this).text() === "00")) {
                $currentCalc.text("");
                /*prevent from writing too long numbers*/
            } else if ($currentCalc.text().length < maxLength) {
                /*prevent from starting with 0 or ERROR*/
                if ($currentCalc.text() === "0" || $currentCalc.text() === "ERROR") {
                    $currentCalc.text("");
                    $wholeCalc.text("");
                }
                $currentCalc.append($(this).text());
            }

            /*on decimal point*/
        } else if ($(this).is($point) && !thePoint.test($currentCalc.text())) {
            /*prevent from starting with ERROR*/
            if ($currentCalc.text() === "ERROR") {
                $currentCalc.text("");
                $wholeCalc.text("");
            }
            $currentCalc.append(".");

            /*on arythmetical operators*/
        } else if ($(this).hasClass("operator")) {
            if ($currentCalc.text()) {
                /*first part of equation*/
                if ($wholeCalc.text() === "") {
                    if (!($(this).hasClass("result"))) {
                        /*prevent from starting with ERROR*/
                        if ($currentCalc.text() === "ERROR") {
                            $currentCalc.text("0");
                            $wholeCalc.text("");
                        }
                        operator = $(this).attr("value");
                        prev = parseFloat($currentCalc.text());
                        $wholeCalc.append($currentCalc.text() + $(this).text());
                        $currentCalc.text("");
                        /*first part of equation after pressing "%" or "(-)*/
                    } else if ($(this).hasClass("result") && !$(this).is($equalSymbol)) {
                        /*prevent from starting with ERROR*/
                        if ($currentCalc.text() === "ERROR") {
                            $currentCalc.text("");
                            $wholeCalc.text("");
                        } else {
                            prev = parseFloat($currentCalc.text());
                            if ($(this).is($percentSymbol)) {
                                equals = percent(prev);
                            } else if ($(this).is($reverseSigns)) {
                                equals = reverse(prev);
                            }
                            $currentCalc.text(equals);
                            equals = 0;
                        }
                    }
                    /*following part of equation or after pressing"=" or following part of equation after pressing "%" or "(-)"*/
                } else {
                    next = parseFloat($currentCalc.text());
                    switch (operator) {
                        case "+":
                            equals = add(prev, next);
                            break;
                        case "-":
                            equals = substract(prev, next);
                            break;
                        case "x":
                            equals = multiply(prev, next);
                            break;
                        case "/":
                            equals = divide(prev, next);
                            break;
                        case "^":
                            equals = power(prev, next);
                            break;
                        case "root":
                            equals = root(prev, next);
                            break;
                    }
                    /*ERRORS*/
                    if (isNaN(equals) || equals === Infinity) {
                        operator = "";
                        $currentCalc.text("ERROR");
                        $wholeCalc.text(equals);
                        equals = 0;
                        setTimeout(function () {
                            $currentCalc.text("");
                            $wholeCalc.text("");
                        }, 3500);
                        /*too long number*/
                    } else if (equals.toString().length > maxLength) {
                        operator = "";
                        $currentCalc.text("ERROR");
                        $wholeCalc.text("Digit limit exceeded");
                        equals = 0;
                        setTimeout(function () {
                            $currentCalc.text("");
                            $wholeCalc.text("");
                        }, 3500);
                        /*after pressing "=" or "%" or "(-)"*/
                    } else if ($(this).hasClass("result")) {
                        operator = "";
                        /*when "%" pressed*/
                        if ($(this).is($percentSymbol)) {
                            equals = percent(equals);
                            /*when "(-)" pressed*/
                        } else if ($(this).is($reverseSigns)) {
                            equals = reverse(equals);
                        }
                        $currentCalc.text(equals);
                        $wholeCalc.text("");
                        /*following part of equation*/
                    } else {
                        operator = $(this).attr("value");
                        $currentCalc.text("");
                        $wholeCalc.text(equals + $(this).text());
                    }
                    prev = equals;
                    next = 0;
                    equals = 0;
                }
            }
            /*on "AC" or "CE" - delete entries*/
        } else if ($(this).hasClass("cancel")) {
            $currentCalc.text("");
            if ($(this).is($ac)) {
                $wholeCalc.text("");
            }
        }
    });
});
