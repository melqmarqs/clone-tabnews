function status(request, response) {
  response.status(200).json({ mensagem: "o endpoint funcionou" });
}

export default status;
