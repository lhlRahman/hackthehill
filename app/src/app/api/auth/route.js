import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { serialize } from 'v8'


export async function POST(request) {
    try {
        const { username, password } = request.body

        const cookie = serialize('session', { username, password }, {
            httpOnly: true,
            path: '/'
        })
        
        return NextResponse.json({ 
            success: true,
            headers: { 'Set-Cookie': cookie }
        })  
    } catch (error) {
        if (error.type === 'CredentialsSignin') {
            return NextResponse.json({ error: "Invalid credentials." }, { status: 401})
        } else {
            return NextResponse.json({ error: "Something went wrong."}, {status: 505})
        }
    }
}