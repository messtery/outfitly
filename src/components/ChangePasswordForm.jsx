// src/components/auth/ChangePasswordForm.jsx
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ChangePasswordForm({ onSubmit }) {
  return (
    <Card className="w-[400px] mx-auto mt-20">
      <CardHeader>
        <h2 className="text-xl font-bold">Change Password</h2>
        <p className="text-sm text-gray-500">Update your account password</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input type="password" placeholder="Current Password" required />
          <Input type="password" placeholder="New Password" required />
          <Input type="password" placeholder="Confirm New Password" required />
          <Button type="submit" className="w-full">Update Password</Button>
        </form>
      </CardContent>
    </Card>
  )
}
