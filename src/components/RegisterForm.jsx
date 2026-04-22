import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"

export default function RegisterForm() {
  return (
    <Card className="w-[350px] mx-auto  bg-gray-100 border border-gray-300">
      <CardHeader>
        <h2 className="text-xl font-bold text-center w-full text-black">Signup</h2>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-black">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" className="border border-gray-300"/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-black">Password</Label>
            <Input id="password" type="password" placeholder="Enter your password" className="border border-gray-300"/>
          </div>
          <Button type="submit" className="w-full border border-gray-300">Create Account</Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-black">Already have an account? Login</p>
      </CardFooter>
    </Card>
  )
}
