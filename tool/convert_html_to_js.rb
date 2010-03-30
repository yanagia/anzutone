result = ""
while line = gets
  result += "'" + line.chomp + "'" + "+"
end

puts result + "''"

