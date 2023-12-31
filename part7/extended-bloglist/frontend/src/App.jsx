import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom'
import { initializeBlogs } from './reducers/blogsReducer'
import { initializeUsers } from './reducers/usersReducer'
import Notification from './components/Notification'
import UserList from './components/UserList'
import Home from './components/Home'
import User from './components/User'
import Blog from './components/Blog'
import Menu from './components/Menu'
import { Container } from '@mui/material'

const App = () => {
	const message = useSelector((state) => state.notification)
	const user = useSelector((state) => state.user)
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(initializeBlogs())
	}, [dispatch])

	useEffect(() => {
		dispatch(initializeUsers())
	}, [dispatch])

	return (
		<Router>
			<Container>
				{user && <Menu />}
				{message !== null && <Notification message={message} />}
				<Routes>
					<Route
						path="/blogs/:id"
						element={user ? <Blog /> : <Navigate to="/" />} />
					<Route
						path="/users/:id"
						element={user ? <User /> : <Navigate to="/" />} />
					<Route
						path="/users"
						element={user ? <UserList /> : <Navigate to="/" />}
					/>
					<Route path="/" element={<Home />} />
				</Routes>
			</Container>
		</Router>
	)
}

export default App
