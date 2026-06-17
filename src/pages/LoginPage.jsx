import { Button } from "@/components/ui/button"
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FieldDescription } from "@/components/ui/field"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")

	const navigate = useNavigate()

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError("")

		try {
			const res = await fetch('http://localhost:3000/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			})

			const data = await res.json()

			if (!res.ok) {
				setError(data.message || 'Invalid email or password')
				return
			}

			localStorage.setItem('token', data.token)
			localStorage.setItem('customer', JSON.stringify(data.customer))
			navigate('/menu')
		} catch {
			setError('Unable to connect. Please try again.')
		}
	}
	
	return (
		<form onSubmit={handleSubmit} className="flex items-center justify-center min-h-screen">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>Login to your account</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-6">
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="m@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="grid gap-2">
							<div className="flex items-center">
								<Label htmlFor="password">Password</Label>
								<a
									href="#"
									className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
								>
									Forgot your password?
								</a>
							</div>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
					</div>
				</CardContent>
				<CardFooter className="flex-col gap-2">
					{error && (
						<p className="text-sm text-red-500 w-full text-center">{error}</p>
					)}
					<Button type="submit" className="w-full">
						Login
					</Button>
					<FieldDescription className="px-6 text-center">
						<span>Don't have an account? <a href="/register" className="underline">Register</a></span>
					</FieldDescription>
				</CardFooter>
			</Card>
		</form>
	)
}
