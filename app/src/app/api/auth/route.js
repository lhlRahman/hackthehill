import { NextResponse } from 'next/server'


export async function POST(request) {
    try {
        const { username, password } = request.body

        return NextResponse.json({ success: true})  
    } catch (error) {
        if (error.type === 'CredentialsSignin') {
            return NextResponse.json({ error: "Invalid credentials." }, { status: 401})
        } else {
            return NextResponse.json({ error: "Something went wrong."}, {status: 505})
        }
    }
}