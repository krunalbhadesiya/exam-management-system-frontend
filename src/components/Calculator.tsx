import { useState } from "react"
import { Button } from "./ui/button"

type Operation = "+" | "-" | "*" | "/" | "=" | "clear" | string

export default function Calculator() {
    const [calcInput, setCalcInput] = useState<string>("")
    const [calcResult, setCalcResult] = useState<number | null>(null)
    const [currentOperation, setCurrentOperation] = useState<Operation | null>(null)
    const [expression, setExpression] = useState<string>("")

    const calculate = (input: string, operation: Operation) => {
        const currentValue = calcResult ?? 0
        const newValue = parseFloat(input)

        switch (operation) {
            case "+":
                return currentValue + newValue
            case "-":
                return currentValue - newValue
            case "*":
                return currentValue * newValue
            case "/":
                return currentValue / newValue
            default:
                return currentValue
        }
    }

    const handleInput = (value: string) => {
        if (value === "=") {
            if (currentOperation && calcInput) {
                const result = calculate(calcInput, currentOperation)
                setCalcResult(result)
                setExpression(`${calcResult ?? 0} ${currentOperation} ${calcInput} = ${result}`)
                setCalcInput("")
                setCurrentOperation(null)
            }
        } else if (value === "clear") {
            setCalcInput("")
            setCalcResult(null)
            setCurrentOperation(null)
            setExpression("")
        } else if (["+", "-", "*", "/"].includes(value)) {
            setCurrentOperation(value as Operation)
            setCalcResult(parseFloat(calcInput) || 0)
            setExpression(`${calcResult ?? 0} ${value} `)
            setCalcInput("")
        } else {
            setCalcInput(calcInput + value)
            setExpression(expression + value)
        }
    }

    return (
        <div className="bg-card rounded-md p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Calculator</h2>
            </div>
            <div className="bg-muted rounded-md p-4 flex flex-col gap-2">
                <div className="flex items-center justify-end text-2xl font-bold">
                    {expression || (calcResult !== null ? `${calcResult}` : "0")}
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {[7, 8, 9, "/", 4, 5, 6, "*", 1, 2, 3, "-", 0, ".", "+", "="].map((value, index) => (
                        <Button
                            key={index}
                            variant={"outline"}
                            className={`    `}
                            onClick={() => handleInput(value as string)}
                        >
                            {value}
                        </Button>
                    ))}
                    <Button
                        variant={"destructive"}
                        className="col-span-4"
                        onClick={() => handleInput("clear")}
                    >
                        Clear
                    </Button>
                </div>
            </div>
        </div>
    )
}
