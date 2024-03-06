//modifica estos valores segun convenga :)
const uppercaseRequired = true
const lowercaseRequired = true
const numberRequired = true
const symbolRequired = true
const allowedSymbols = '@#$%&¿?¡!*^-_'
const lengthEnabled = false
const minLength = 8     //usa 0 si quieres que no haya limite minimo
const maxLength = 30    //usa '' si quieres que no haya limite maximo

let rules = '^'
rules += uppercaseRequired ? '(?=.*?[A-Z])' : ''
rules += lowercaseRequired ? '(?=.*?[a-z])' : ''
rules += numberRequired ? '(?=.*?[0-9])' : ''
rules += symbolRequired ? `(?=.*?[${allowedSymbols}])` : ''
rules += '.'
rules += lengthEnabled ? `{${minLength},${maxLength}}` : '*'
rules += '$'

//rules = '/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[@#$%&¿?¡!*^-_]).{8,30}$/' //valor seguro de las reglas por defecto
console.log(rules)
export const regularExpression = new RegExp(rules)