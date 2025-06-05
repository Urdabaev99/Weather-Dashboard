export const toCelsius = (kelvin: number): number => {
  return parseFloat((kelvin - 273.15).toFixed(2));
};

export const toFahrenheit = (kelvin: number): number => {
  return parseFloat((((kelvin - 273.15) * 9) / 5 + 32).toFixed(2));
};
