export const calculateAvgHitrate = (percentages=[]) => {
  return percentages.reduce((a, b) => (a+b))/(percentages.length)*(100)
}

