import { Card, CardContent } from "@/components/ui/card"

export default function ExamStatus() {


  return (
    <div className="min-h-screen w-full bg-cover bg-center flex items-center justify-center p-4"
      style={{ backgroundImage: "url('/exam-status-bg.jpeg')" }}>
      <div className="absolute inset-0 backdrop-blur-md"></div>
      <Card className="p-0 w-full max-w-md relative z-10 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
        <CardContent className='p-0 overflow-hidden rounded-md'>
          <img src="/check.gif" className='w-full' alt="" />
          <div className='text-white text-lg text-center py-4 '>
            Success! 
            <br />
            Your exam has been submitted.Well done! 👍
          </div>
        </CardContent>
        {/* <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">Online Exam Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-white">Current Exam</h2>
            <p className="text-xl font-bold text-white">Advanced Mathematics</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white">Progress</h3>
            <p className="text-sm text-white">{progress}% Complete</p>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-white">Time Remaining</h3>
              <p className="text-2xl font-bold text-white">00:45:30</p>
            </div>
            <Badge variant="outline" className="text-white border-white">In Progress</Badge>
          </div>
        </CardContent> */}
      </Card>
    </div>
  )
}