export const createMemoryGame = (difficulty_level) => {
    console.log(difficulty_level)
    // get size
    const size = difficulty_level * difficulty_level;

    // declare array
    const temp = []

    // add all elements in array - twice
    for (let i = 0 ; i < size/2 ; i++){
        temp.push(i + 1, i + 1)
    }

    for (let i = 0 ; i < size ; i++){
        const j = Math.floor(Math.random() * (i + 1));
        [temp[i], temp[j]] = [temp[j], temp[i]]
    }

    return temp

}