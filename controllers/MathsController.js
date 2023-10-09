import MathModel from '../models/math.js';
import Repository from '../models/repository.js';
import Controller from './Controller.js';
import path from 'path';
import fs from 'fs';

export default class MathsController extends Controller {
    constructor(HttpContext) {
        super(HttpContext, new Repository(new MathModel()));
    }
    invalidNumbers(response, x = null, y = null, n = null,) {
        if (x != null && isNaN(x)) {
            response.error = "Le paramètre 'x' n'est pas un nombre";
            return response;
        }
        if (y != null && isNaN(y)) {
            response.error = "Le paramètre 'y' n'est pas un nombre";
            return response;
        }
        if (n != null && isNaN(n)) {
            response.error = "Le paramètre 'n' n'est pas un nombre";
            return response;
        }

    }
    invalidNumberParametersXY(response) {
        if (Object.keys(response).length != 3) {
            response.error = "Un ou des paramètres superflues sont fournis.";
            return response;
        }
        if (response["x"] == null || response["y"] == null) {
            response.error = "Un ou des paramètres sont manquants.";
            return response;
        }
        return false;
    }
    invalidNumberParametersN(response) {
        let n = response["n"];
        if (Object.keys(response).length != 2) {
            response.error = "Un ou des paramètres superflues sont fournis.";
            return response;
        }
        if (n == null) {
            response.error = "Un ou des paramètres sont manquants.";
            return response;
        }
        if (/[\.]/.test(String(n))) { // is float
            response.error = "Le paramètre fourni pour cette opération dois être un nombre entier.";
            return response;
        }
        if (parseInt(n) <= 0) {
            response.error = "Le paramètre fourni pour cette opération dois être un nombre positif.";
            return response;
        }
        return false;
    }
    doAddition(x, y) {
        return parseInt(x) + parseInt(y);
    }
    doSubstraction(x, y) {
        return x - y;
    }
    doMultiplication(x, y) {
        return x * y;
    }
    doDivision(x, y) {
        if (y == 0) {
            if (x == 0)
                return "NaN";
            return "Infinity";
        }
        return x / y;
    }
    doModulo(x, y) {
        if (y == 0) {
            return "NaN";
        }
        return x % y;
    }
    doFactorial(n) {
        if (n === 0 || n === 1) {
            return 1;
        }
        return n * this.doFactorial(n - 1);
    }

    factorial(n) {
        if (n === 0 || n === 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }

    isPrime(value) {
        for (var i = 2; i < value; i++) {
            if (value % i === 0) {
                return false;
            } else if (value % 1 != 0) {
                //response.error = "Un ou des paramètres sont manquants";
                return false;
            }
        }
        return value > 1;
    }
    findPrime(n) {
        let primeNumer = 0;
        for (let i = 0; i < n; i++) {
            primeNumer++;
            while (!this.isPrime(primeNumer)) {
                primeNumer++;
            }
        }
        return primeNumer;
    }
    doOperation() {
        let params = this.HttpContext.path.params;
        let op = params["op"];
        let response = { "op": op } //Makes op first for ease of view
        for (var key in params) {
            response[key.toLowerCase()] = params[key];
        }

        let x = response["x"];
        let y = response["y"];
        let n = response["n"];

        if (op) {
            switch (op) {
                case ' ':
                    response.op = '+';
                    if (!this.invalidNumbers(response, x, y, n) &&
                        !this.invalidNumberParametersXY(response))
                        response.value = this.doAddition(x, y);
                    this.HttpContext.response.JSON(response);
                    break;
                case '-':
                    if (!this.invalidNumbers(response, x, y, n) &&
                        !this.invalidNumberParametersXY(response))
                        response.value = this.doSubstraction(x, y);
                    this.HttpContext.response.JSON(response);
                    break;
                case '*':
                    if (!this.invalidNumbers(response, x, y, n) &&
                        !this.invalidNumberParametersXY(response))
                        response.value = this.doMultiplication(x, y);
                    this.HttpContext.response.JSON(response);
                    break;
                case '/':
                    if (!this.invalidNumbers(response, x, y, n) &&
                        !this.invalidNumberParametersXY(response))
                        response.value = this.doDivision(x, y);
                    this.HttpContext.response.JSON(response);
                    break;
                case '%':
                    if (!this.invalidNumbers(response, x, y, n) &&
                        !this.invalidNumberParametersXY(response))
                        response.value = this.doModulo(x, y);
                    this.HttpContext.response.JSON(response);
                    break;
                case '!':
                    if (!this.invalidNumbers(response, x, y, n) &&
                        !this.invalidNumberParametersN(response))
                        response.value = this.doFactorial(parseInt(n));
                    this.HttpContext.response.JSON(response);
                    break;
                case 'p':
                    if (!this.invalidNumbers(response, x, y, n) &&
                        !this.invalidNumberParametersN(response))
                        response.value = this.isPrime(n);
                    this.HttpContext.response.JSON(response);
                    break;
                case 'np':
                    if (!this.invalidNumbers(response, x, y, n) &&
                        !this.invalidNumberParametersN(response))
                        response.value = this.findPrime(n);
                    this.HttpContext.response.JSON(response);
                    break;
                default:
                    this.HttpContext.response.notFound("Opération inexistante.");
                    break;
            }
        } else {
            this.HttpContext.response.unprocessable("Aucune opération fournie.");
        }
    }

    post() { throw new NotImplementedException(); }
    put() { throw new NotImplementedException(); }
    remove() { throw new NotImplementedException(); }
    help() {
        let helpPagePath = path.join(process.cwd(), wwwroot, 'API-Maths-Help.html');
        this.HttpContext.response.HTML(fs.readFileSync(helpPagePath));
    }
    get() {
        if (this.HttpContext.path.queryString == '?')
            this.help();
        else
            this.doOperation();
    }
}