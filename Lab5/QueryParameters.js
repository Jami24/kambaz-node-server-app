export default function QueryParameters(app) {
    const calculator = (req, res) => {
        const { a, b, operation } = req.query;

        const numberA = parseInt(a);
        const numberB = parseInt(b);

        let result = 0;

        switch (operation) {
            case "add":
                result = numberA + numberB;
                break;
            case "subtract":
                result = numberA - numberB;
                break;
            case "multiply":
                result = numberA * numberB;
                break;
            case "divide":
                result = numberA / numberB;
                break;
            default:
                result = "Invalid operation";
        }

        res.send(result.toString());
    };

    app.get("/lab5/calculator", calculator);
}