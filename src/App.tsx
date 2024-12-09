import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useCanvasImage } from '@/hooks/useCanvasImage'

export default function ImageGenerator() {
  const [backgroundColor, setBackgroundColor] = useState('#A1FEA0')
  const [text, setText] = useState('Hello, Twitter!')
  const [fontSize, setFontSize] = useState(64)

  const { canvasRef, downloadImage } = useCanvasImage({
    backgroundColor,
    text,
    fontSize,
  })

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl mb-6 px-4 font-gt italic font-medium">eGenerator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Label htmlFor="backgroundColor">Background Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-12 h-12 p-1 rounded-md"
                  />
                  <Input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-grow"
                    placeholder="#A1FEA0"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="text">Text</Label>
                <Input
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter your text here"
                />
              </div>
              <div>
                <Label htmlFor="fontSize">Font Size</Label>
                <Input
                  id="fontSize"
                  type="number"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  min={1}
                  max={200}
                />
              </div>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <canvas ref={canvasRef} style={{ width: '100%', height: 'auto' }} />
            </div>
            <Button onClick={downloadImage} className="mt-4 w-full">
              Download Twitter Post Image
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

