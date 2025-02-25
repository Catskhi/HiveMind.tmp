const getHexRandomCharacter = (): string => {
    const characterPool: string = "###%%%@@@00~!*="
    return characterPool[Math.floor(Math.random() * characterPool.length)]
}

const getRandomRepeat = (line_size: number): string => {
    let complete_line: string = ""
    for (let i = 0; i < line_size; i++) {
        complete_line += getHexRandomCharacter()
    }
    return complete_line
}

const generateHexLine = (length: number, character?: string) => {
    if (character) {
        return character.repeat(length)
    }
    return getRandomRepeat(length)
}

export const generateHex = (size: number, line_size: number, character?: string): string => {
    let hexagon: string = ""
    for (let i = 0; i < size; i++) {
        let hashes = generateHexLine(line_size, character)
        let spaces = " ".repeat(size - i - 1)
        if (i < (line_size / 2 )) {
            hashes = generateHexLine((line_size * 2) + (i * 2), character)
            if (i == 0) {
                hexagon += spaces + hashes
                continue
            }
            hexagon += "\n" + spaces + hashes
            continue
        }
        if (i >= size - (size / line_size) - 1) {
            spaces = " ".repeat(size - i - 1)
            hexagon += "\n" + spaces + hashes + " ".repeat((i * 2)) + hashes
            continue
        }
        hexagon += "\n" + spaces + hashes + " ".repeat((i * 2)) + hashes
    }
    for (let i = size; i > 0; i--) {
        let hashes = generateHexLine(line_size, character)
        if (i <= (line_size+1) / 2) {
            hashes = generateHexLine((line_size * 2) + (i), character)
            if (i-2 < 0) {
                hashes = generateHexLine((line_size * 2), character)
                hexagon += "\n" + " ".repeat(size - i) + hashes
                continue
            }
            hexagon += "\n" + " ".repeat(size - i) + hashes + generateHexLine(i-2, character)
            continue
        }
        hexagon += "\n" + " ".repeat(size - i) + hashes + " ".repeat((i * 2)-2) + hashes
    }
    return hexagon
}