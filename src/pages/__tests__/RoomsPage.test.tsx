
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import RoomsPage from '../Rooms'
import { CREATE_ROOM, ADD_COMMENT_TO_ROOM } from '../../graphQL/mutations/Rooms'
import { GET_ROOMS_WITH_MESSAGES } from '../../graphQL/queries/Rooms'





// mock do user autenticado

jest.mock('@nhost/react', () => ({
  useUserData: () => ({ id: 'user123' }),
}))

const mockRoomsData = [
  {
    id: '1',
    name: 'Sala Teste',
    user_id: 'user123',
    created_at: new Date().toISOString(),
    messages: [
      {
        id: 'msg1',
        content: 'Comentário inicial',
        user_id: 'user123',
        created_at: new Date().toISOString(),
        room_id: '1'
      }
    ]
  }
]

const mocks = [
  {
    request: {
      query: GET_ROOMS_WITH_MESSAGES
    },
    result: {
      data: {
        rooms: mockRoomsData
      }
    }
  },
  {
    request: {
      query: CREATE_ROOM,
      variables: { name: 'Nova Sala' }
    },
    result: {
      data: {
        insert_rooms_one: {
          id: '2',
          name: 'Nova Sala'
        }
      }
    }
  },
  {
    request: {
      query: ADD_COMMENT_TO_ROOM,
      variables: {
        room_id: '1',
        content: 'Novo comentário'
      }
    },
    result: {
      data: {
        insert_messages_one: {
          id: 'msg2',
          content: 'Novo comentário',
          user_id: 'user123',
          created_at: new Date().toISOString(),
          room_id: '1'
        }
      }
    }
  }
]







test('renderiza a lista de salas', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <RoomsPage />
    </MockedProvider>
  )

  expect(screen.getByText(/Carregando salas/i)).toBeInTheDocument()

  const sala = await screen.findByText('Sala Teste')
  expect(sala).toBeInTheDocument()
})






test('cria nova sala quando dados são válidos', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <RoomsPage />
    </MockedProvider>
  )

  await screen.findByText('Criar Nova Sala')

  const input = screen.getByPlaceholderText('Nome da Sala')
  fireEvent.change(input, { target: { value: 'Nova Sala' } })

  const botaoCriar = screen.getByText('Criar Sala')
  fireEvent.click(botaoCriar)

  await waitFor(() => {
    expect(screen.queryByDisplayValue('Nova Sala')).not.toBeInTheDocument()
  })
})






test('exibe erro se tentar criar sala com nome duplicado', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <RoomsPage />
    </MockedProvider>
  )

  await screen.findByText('Sala Teste')

  fireEvent.change(screen.getByPlaceholderText('Nome da Sala'), {
    target: { value: 'Sala Teste' }
  })

  fireEvent.click(screen.getByText('Criar Sala'))

  await screen.findByText(/Já existe uma sala/i)
})






test('add um comentário em uma sala', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <RoomsPage />
    </MockedProvider>
  )

  const botaoVer = await screen.findByText('Ver Sala')
  fireEvent.click(botaoVer)

  const campoComentario = screen.getByPlaceholderText('Digite seu comentário...')
  fireEvent.change(campoComentario, { target: { value: 'Novo comentário' } })

  fireEvent.click(screen.getByText('Enviar'))

  await waitFor(() => {
    expect(screen.queryByDisplayValue('Novo comentário')).not.toBeInTheDocument()
  })
})



