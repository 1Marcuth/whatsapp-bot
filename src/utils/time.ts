function sleep(ms: number) {
    return new Promise(resolve => {
        setTimeout(() => resolve(null), ms)
    })
}

function isoToDate(isoDate: string): string {
    const dateObj = new Date(isoDate)
    const day = String(dateObj.getDate()).padStart(2, "0")
    const mnth = String(dateObj.getMonth() + 1).padStart(2, "0")
    const year = dateObj.getFullYear()
    return `${day}/${mnth}/${year}`
}

export {
    sleep,
    isoToDate
}