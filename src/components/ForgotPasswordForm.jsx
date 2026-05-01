import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ForgotPasswordForm({ onSubmit }) {
  return (
    <Card className="w-[400px] mx-auto mt-20">
      <CardHeader>
        <h2 className="text-xl font-bold">Forgot Password</h2>
        <p className="text-sm text-gray-500">Enter your email to reset your password</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input type="email" placeholder="Email" required />
          <Button type="submit" className="w-full">Send Reset Link</Button>
        </form>
      </CardContent>
    </Card>
  )
}
