import { useState } from 'react'
import FormsPage from './pages/forms'
import CreateFormPage from './pages/create-form'

function App() {
  const [page, setPage] = useState<'list' | 'create'>('list')

  if (page === 'create') {
    return <CreateFormPage onBack={() => setPage('list')} />
  }

  return <FormsPage onCreateForm={() => setPage('create')} />
}

export default App
