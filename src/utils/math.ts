function evaluateMathOperation(operation: string): any {
    const regex = /^[+\-*/%.\d\s()]+$/

    if (!regex.test(operation)) {
        throw new Error("Entrada inválida: Código malicioso detectado")
    }

    return eval(operation)
}

export {
    evaluateMathOperation
}