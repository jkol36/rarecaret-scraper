export const parseResults = (json) => {
  console.log('got json', json)
  let { Data:{diamonds} } = json
  diamonds.forEach(diamond => {
    console.log(diamond)
  })
}