import { useState } from "react"
import { Button, Textarea } from "../../components"

export const SettingsAccessPage = () => {
    const [publicKey, setPublicKey] = useState("")

    return <div className="w-full h-full flex flex-col gap-2">
        <h2 className="text-3xl text-white">
            Access
        </h2>
        <hr className="w-full bg-gray" />
        <div className="flex flex-col gap-2">
            <Textarea
                label="Public Key:"
                className="text-white h-40"
                placeholder="Paste your public key here..."
                value={publicKey} onChange={(e: any) => setPublicKey(e.target.value)} />
            <div className="flex w-full">
                <Button className="w-[200px]">Save</Button>
            </div>
        </div>

    </div>
}