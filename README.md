### Abreviações

- **RF** - Requisitos Funcionais
- **RNF** - Requisitos Não Funcionais
- **RN** - Regras de Negócio

# Carro

## Cadastro de Carro

- **RF**

  - Deve ser possível cadastrar um novo carro.

- **RNF**

  - Não deve ser possível cadastrar um carro quando a categoria não for um uuid válido.

- **RN**

  - Não deve ser possível cadastrar um carro com uma placa já existente.
  - O carro deve ser cadastrado com disponibilidade ativa por padrão.
  - Somente usuários administradores poderão realizar cadastros.

## Listagem de Carros

- **RF**

  - Deve ser possível listar todos os carros disponíveis.
  - Deve ser possível listar todos os carros disponíveis pelo nome da categoria.
  - Deve ser possível listar todos os carros disponíveis pelo nome da marca.
  - Deve ser possível listar todos os carros disponíveis pelo nome do carro.

- **RNF**

  - Não deve ser possível filtrar os carros quando o filtro de categoria não for um uuid válido.

- **RN**

  - O usuário não precisa estar autenticado no sistema.

# Especificação

## Cadastro de Especificação do Carro

- **RF**

  - Deve ser possível cadastrar uma especificação para um carro.
  - Somente usuários administradores poderão realizar cadastros.

- **RN**

  - Não deve ser possível cadastrar uma especificação para um carro não cadastrado.
  - Não deve ser possível cadastrar uma especificação já existente para o mesmo carro.

# Imagem do Carro

## Cadastro de Imagens do Carro

- **RF**

  - Deve ser possível cadastrar a imagens do carro.

- **RNF**

  - Utilizar o Multer para upload dos arquivos.

- **RN**

  - Deve ser possível o cadastro de várias imagens para o mesmo carro.
  - Somente usuários administradores poderão realizar cadastros.

# Aluguel

## Registro de Aluguel

- **RF**

  - Deve ser possível cadastrar um aluguel.

- **RN**

  - O aluguel deve ter duração mínima de 24h.
  - Não deve ser possível cadastrar um aluguel caso já exista um em aberto para o mesmo usuário.
  - Não deve ser possível cadastrar um aluguel caso já exista um em aberto para o mesmo carro.
  - O usuário deve estar logado.
  - Ao realizar um aluguel, o status do carro deve ser alterado para indisponível.

## Devolução de carro

- **RF**

  - Deve ser possível realizar a devolução de um carro

- **RN**

  - Se o carro for devolvido com menos de 24 horas, deverá ser cobrado diária completa.
  - Ao realizar a devolução, o carro deverá ficar disponível para um novo aluguel.
  - Ao realizar a devolução, o usuário deverá ser liberado para realizar um novo aluguel.
  - Ao realizar a devolução, deverá ser calculado o valor total do aluguel.
  - Caso o horário de devolução seja superior ao horário previsto de entrega, deverá ser cobrado multa proporcional aos dias de atraso.
  - Caso haja multa, deverá ser somado ao valor total do aluguel.
  - O usuário deve estar logado.

## Listagem de aluguéis para usuário

- **RF**

  - Deve ser possível realizar a busca de todos os aluguéis para o usuário.

- **RN**

  - O usuário deve estar logado.


# Usuário

## Recuperar Senha

- **RF**

  - Deve ser possível o usuário recuperar a senha informando o e-mail
  - O usuário deve receber um e-mail com o passo a passo para a recuperação da senha
  - O usuário deve conseguir inserir uma nova senha

- **RN**

  - O usuário precisa informar uma nova senha
  - O link enviado para a recuperação deve explirar em 3 horas