"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Send,
  Map,
  Plus,
  Settings,
  Target,
  Users,
  AlertTriangle,
  Route,
  Truck,
  FileText,
  Package,
  Menu,
} from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  staffFunction: StaffFunction
  analysis?: any
}

type StaffFunction = "operations" | "logistics" | "personnel" | "admin" | "intelligence"

interface LogisticsData {
  supplies: SupplyItem[]
  vehicles: Vehicle[]
  fuelStatus: FuelStatus
  maintenanceSchedule: MaintenanceItem[]
}

interface SupplyItem {
  id: string
  name: string
  quantity: number
  unit: string
  status: "adequate" | "low" | "critical"
  location: string
}

interface Vehicle {
  id: string
  type: string
  callSign: string
  status: "operational" | "maintenance" | "deadlined"
  fuelLevel: number
  location: string
}

interface FuelStatus {
  diesel: { current: number; capacity: number }
  gasoline: { current: number; capacity: number }
  jp8: { current: number; capacity: number }
}

interface MaintenanceItem {
  id: string
  vehicle: string
  type: string
  dueDate: string
  priority: "routine" | "urgent" | "critical"
}

interface PersonnelData {
  strength: UnitStrength
  casualties: CasualtyReport[]
  training: TrainingStatus[]
  awards: AwardRecommendation[]
}

interface UnitStrength {
  authorized: number
  assigned: number
  present: number
  available: number
}

interface CasualtyReport {
  id: string
  name: string
  rank: string
  type: "KIA" | "WIA" | "MIA" | "RTD"
  date: string
  status: string
}

interface TrainingStatus {
  id: string
  training: string
  completed: number
  total: number
  dueDate: string
}

interface AwardRecommendation {
  id: string
  name: string
  rank: string
  award: string
  status: "pending" | "approved" | "submitted"
}

export default function KoreanMilitaryStaff() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "안녕하세요. 저는 종합 군사 참모 보조 AI입니다. 작전과, 군수과, 인사과, 행정과, 정보과 업무를 지원할 수 있습니다. 참모 기능을 선택하시고 어떤 도움이 필요한지 말씀해 주세요.",
      timestamp: new Date(),
      staffFunction: "operations",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentStaffFunction, setCurrentStaffFunction] = useState<StaffFunction>("operations")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMapOpen, setIsMapOpen] = useState(false)
  const [isDataOpen, setIsDataOpen] = useState(false)

  // 샘플 데이터
  const [logisticsData] = useState<LogisticsData>({
    supplies: [
      { id: "1", name: "전투식량", quantity: 450, unit: "식", status: "adequate", location: "보급소 알파" },
      { id: "2", name: "5.56mm 탄약", quantity: 12000, unit: "발", status: "adequate", location: "탄약고 브라보" },
      { id: "3", name: "의료용품", quantity: 85, unit: "세트", status: "low", location: "의무대" },
      { id: "4", name: "급수", quantity: 2400, unit: "리터", status: "critical", location: "급수소 찰리" },
    ],
    vehicles: [
      {
        id: "1",
        type: "K-131 소형트럭",
        callSign: "강철-1",
        status: "operational",
        fuelLevel: 85,
        location: "차량정비소",
      },
      { id: "2", type: "K2 흑표", callSign: "천둥-6", status: "operational", fuelLevel: 70, location: "전차주기장" },
      { id: "3", type: "K21 보병전투차", callSign: "전사-3", status: "maintenance", fuelLevel: 45, location: "정비창" },
      {
        id: "4",
        type: "KM250 중형트럭",
        callSign: "화물-2",
        status: "operational",
        fuelLevel: 90,
        location: "보급지역",
      },
    ],
    fuelStatus: {
      diesel: { current: 8500, capacity: 12000 },
      gasoline: { current: 3200, capacity: 5000 },
      jp8: { current: 15000, capacity: 20000 },
    },
    maintenanceSchedule: [
      { id: "1", vehicle: "천둥-6", type: "예방정비", dueDate: "2024-01-15", priority: "routine" },
      { id: "2", vehicle: "전사-3", type: "엔진수리", dueDate: "2024-01-12", priority: "critical" },
      { id: "3", vehicle: "강철-1", type: "타이어교체", dueDate: "2024-01-18", priority: "urgent" },
    ],
  })

  const [personnelData] = useState<PersonnelData>({
    strength: {
      authorized: 120,
      assigned: 115,
      present: 108,
      available: 102,
    },
    casualties: [
      { id: "1", name: "김철수", rank: "중사", type: "WIA", date: "2024-01-10", status: "안정" },
      { id: "2", name: "이영희", rank: "일병", type: "RTD", date: "2024-01-08", status: "완전복무" },
    ],
    training: [
      { id: "1", training: "전투구급법", completed: 85, total: 108, dueDate: "2024-02-01" },
      { id: "2", training: "사격술 검정", completed: 102, total: 108, dueDate: "2024-01-30" },
      { id: "3", training: "NBC 훈련", completed: 45, total: 108, dueDate: "2024-03-15" },
    ],
    awards: [
      { id: "1", name: "박민수", rank: "상사", award: "육군포장", status: "pending" },
      { id: "2", name: "정수진", rank: "병장", award: "육군표창", status: "approved" },
    ],
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const analyzeByStaffFunction = (text: string, staffFunction: StaffFunction): any => {
    switch (staffFunction) {
      case "operations":
        return {
          type: "operational",
          summary: {
            objective:
              text.toLowerCase().includes("정찰") || text.toLowerCase().includes("순찰")
                ? "정찰순찰 실시"
                : "임무 분석 필요",
            unitSize: text.toLowerCase().includes("분대")
              ? "분대 (9-12명)"
              : text.toLowerCase().includes("소대")
                ? "소대 (30-40명)"
                : "부대규모 미지정",
            timeline: text.includes("0600")
              ? "H시간: 0600"
              : text.includes("즉시")
                ? "즉시 실행"
                : "시간계획 명확화 필요",
            location: text.toLowerCase().includes("좌표") ? "좌표 제공됨" : "위치좌표 필요",
          },
          risks: ["제한된 시계 조건", "통신두절 지역 가능성", "이동 중 노출 위험"],
          suggestions: ["감시초소 설치", "통신절차 확인", "인접부대와 협조", "집결지 및 비상계획 수립"],
          doctrineRef: "야전교범 3-0 작전술",
        }

      case "logistics":
        return {
          type: "logistics",
          assessment: {
            supplyStatus: "급수 위험, 의료용품 부족",
            transportCapacity: "4대 중 3대 가동",
            fuelStatus: "경유 71% 보유",
            maintenancePriority: "긴급정비 1건, 우선정비 1건",
          },
          recommendations: [
            "급수 즉시 보급 필요",
            "의료용품 긴급 배송",
            "전사-3 긴급정비 완료",
            "48시간 내 연료 보급 계획",
          ],
          doctrineRef: "야전교범 4-0 군수지원",
        }

      case "personnel":
        return {
          type: "personnel",
          strength: {
            currentStrength: "편제 120명 중 102명 가용 (85%)",
            casualties: "부상 1명 안정, 복귀 1명 완전복무",
            trainingStatus: "전투구급법 79% 완료",
          },
          actions: [
            "8명 보충 요청 처리",
            "2월 1일까지 전투구급법 완료",
            "2명 포상 추천서 제출",
            "손실현황 보고서 갱신",
          ],
          doctrineRef: "육군규정 600-8-1 손실작전",
        }

      case "admin":
        return {
          type: "administrative",
          tasks: {
            reports: "일일 병력현황 보고 0800시 마감",
            correspondence: "3건 행정업무 대기",
            records: "인사기록 갱신 필요",
            compliance: "이번 주 안전교육 실시",
          },
          priorities: [
            "일일 병력현황 보고서 제출",
            "안전교육 문서 작성 완료",
            "휴가신청서 처리 (5건 대기)",
            "부대명부 및 연락처 갱신",
          ],
          doctrineRef: "육군규정 25-50 공문서 작성",
        }

      case "intelligence":
        return {
          type: "intelligence",
          assessment: {
            threatLevel: "보통 - 해당 지역 활동 증가",
            weather: "맑음, 가시거리 10km 이상",
            terrain: "개활지로 기계화 이동 유리",
            enemy: "최근 24시간 적 접촉 없음",
          },
          recommendations: ["현재 경계태세 유지", "정찰순찰 지속", "통신감청 모니터링", "위협평가 일일 갱신"],
          doctrineRef: "야전교범 2-0 정보",
        }

      default:
        return null
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
      staffFunction: currentStaffFunction,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const analysis = analyzeByStaffFunction(inputValue, currentStaffFunction)
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content: `${getStaffFunctionName(currentStaffFunction)} 요청을 분석했습니다. 다음은 제 평가입니다:`,
      timestamp: new Date(),
      staffFunction: currentStaffFunction,
      analysis,
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsTyping(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getStaffFunctionName = (func: StaffFunction): string => {
    switch (func) {
      case "operations":
        return "작전과"
      case "logistics":
        return "군수과"
      case "personnel":
        return "인사과"
      case "admin":
        return "행정과"
      case "intelligence":
        return "정보과"
    }
  }

  const getStaffFunctionIcon = (func: StaffFunction) => {
    switch (func) {
      case "operations":
        return <Target className="w-4 h-4" />
      case "logistics":
        return <Truck className="w-4 h-4" />
      case "personnel":
        return <Users className="w-4 h-4" />
      case "admin":
        return <FileText className="w-4 h-4" />
      case "intelligence":
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string): string => {
    switch (status) {
      case "adequate":
        return "충분"
      case "low":
        return "부족"
      case "critical":
        return "위험"
      case "operational":
        return "가동"
      case "maintenance":
        return "정비중"
      case "deadlined":
        return "고장"
      case "routine":
        return "일반"
      case "urgent":
        return "우선"
      case "pending":
        return "대기"
      case "approved":
        return "승인"
      default:
        return status
    }
  }

  const renderAnalysis = (analysis: any) => {
    if (!analysis) return null

    switch (analysis.type) {
      case "operational":
        return (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  임무 요약
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium">목표:</span> {analysis.summary.objective}
                  </div>
                  <div>
                    <span className="font-medium">부대규모:</span> {analysis.summary.unitSize}
                  </div>
                  <div>
                    <span className="font-medium">시간계획:</span> {analysis.summary.timeline}
                  </div>
                  <div>
                    <span className="font-medium">위치:</span> {analysis.summary.location}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">위험요소 및 건의사항</h3>
                <div className="space-y-2 text-sm">
                  {analysis.suggestions.map((suggestion: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      {suggestion}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "logistics":
        return (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  군수 평가
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">보급현황:</span> {analysis.assessment.supplyStatus}
                  </div>
                  <div>
                    <span className="font-medium">수송능력:</span> {analysis.assessment.transportCapacity}
                  </div>
                  <div>
                    <span className="font-medium">연료현황:</span> {analysis.assessment.fuelStatus}
                  </div>
                  <div>
                    <span className="font-medium">정비우선순위:</span> {analysis.assessment.maintenancePriority}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">권고사항</h3>
                <div className="space-y-2 text-sm">
                  {analysis.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      {rec}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "personnel":
        return (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  인사 현황
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">병력현황:</span> {analysis.strength.currentStrength}
                  </div>
                  <div>
                    <span className="font-medium">손실현황:</span> {analysis.strength.casualties}
                  </div>
                  <div>
                    <span className="font-medium">훈련현황:</span> {analysis.strength.trainingStatus}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">필요 조치사항</h3>
                <div className="space-y-2 text-sm">
                  {analysis.actions.map((action: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      {action}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "administrative":
        return (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  행정 업무
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">보고서:</span> {analysis.tasks.reports}
                  </div>
                  <div>
                    <span className="font-medium">공문처리:</span> {analysis.tasks.correspondence}
                  </div>
                  <div>
                    <span className="font-medium">기록관리:</span> {analysis.tasks.records}
                  </div>
                  <div>
                    <span className="font-medium">규정준수:</span> {analysis.tasks.compliance}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">우선 처리사항</h3>
                <div className="space-y-2 text-sm">
                  {analysis.priorities.map((priority: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      {priority}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "intelligence":
        return (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  정보 평가
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">위협수준:</span> {analysis.assessment.threatLevel}
                  </div>
                  <div>
                    <span className="font-medium">기상상황:</span> {analysis.assessment.weather}
                  </div>
                  <div>
                    <span className="font-medium">지형분석:</span> {analysis.assessment.terrain}
                  </div>
                  <div>
                    <span className="font-medium">적 활동:</span> {analysis.assessment.enemy}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">권고사항</h3>
                <div className="space-y-2 text-sm">
                  {analysis.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                      {rec}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  // 모바일 지도 모달 컴포넌트
  const MapModal = () => (
    <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] p-0">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle>전술 지도</DialogTitle>
        </DialogHeader>
        <div className="px-4 pb-4">
          <ScrollArea className="h-[70vh]">
            <div className="space-y-4">
              <div className="bg-gray-100 h-48 rounded-lg overflow-hidden relative">
                <img src="/tactical-map-alpha.png" alt="전술지도 - 알파구역" className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-xs">
                  알파구역 - 좌표 38SMB
                </div>
              </div>
              <div className="bg-gray-100 h-48 rounded-lg overflow-hidden relative">
                <img
                  src="/satellite-base-charlie.png"
                  alt="위성사진 - 찰리기지"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-xs">
                  찰리기지 - 위성사진
                </div>
              </div>
              <div className="bg-gray-100 h-48 rounded-lg overflow-hidden relative">
                <img
                  src="/topographic-bravo.png"
                  alt="지형도 - 브라보작전지역"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-xs">
                  브라보작전지역 - 지형도
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Route className="w-4 h-4" />
                  현재 경로
                </h4>
                <div className="space-y-2">
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">주경로</div>
                    <div className="text-xs text-gray-500">기지 → 알파검문소 → 목표지점</div>
                    <div className="text-xs text-green-600">상태: 안전</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">우회경로</div>
                    <div className="text-xs text-gray-500">기지 → 브라보검문소 → 목표지점</div>
                    <div className="text-xs text-yellow-600">상태: 주의</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">보급경로</div>
                    <div className="text-xs text-gray-500">보급소 → 기지</div>
                    <div className="text-xs text-green-600">상태: 확보</div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )

  // 모바일 데이터 모달 컴포넌트
  const DataModal = () => (
    <Dialog open={isDataOpen} onOpenChange={setIsDataOpen}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] p-0">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle>부대 현황 데이터</DialogTitle>
        </DialogHeader>
        <div className="px-4 pb-4">
          <Tabs defaultValue="supplies" className="h-[70vh] flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="supplies">보급품</TabsTrigger>
              <TabsTrigger value="vehicles">장비</TabsTrigger>
              <TabsTrigger value="personnel">인사</TabsTrigger>
            </TabsList>

            <TabsContent value="supplies" className="flex-1 overflow-hidden mt-4">
              <ScrollArea className="h-full">
                <div className="space-y-3">
                  {logisticsData.supplies.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-sm">{item.name}</div>
                          <Badge
                            variant={
                              item.status === "adequate"
                                ? "default"
                                : item.status === "low"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="text-xs"
                          >
                            {getStatusText(item.status)}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>
                            수량: {item.quantity} {item.unit}
                          </div>
                          <div>위치: {item.location}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="vehicles" className="flex-1 overflow-hidden mt-4">
              <ScrollArea className="h-full">
                <div className="space-y-3">
                  {logisticsData.vehicles.map((vehicle) => (
                    <Card key={vehicle.id}>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-sm">{vehicle.callSign}</div>
                          <Badge
                            variant={vehicle.status === "operational" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {getStatusText(vehicle.status)}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>차종: {vehicle.type}</div>
                          <div>연료: {vehicle.fuelLevel}%</div>
                          <div>위치: {vehicle.location}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="personnel" className="flex-1 overflow-hidden mt-4">
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">부대 병력</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-xs space-y-1">
                        <div>편제: {personnelData.strength.authorized}명</div>
                        <div>배치: {personnelData.strength.assigned}명</div>
                        <div>현재: {personnelData.strength.present}명</div>
                        <div>가용: {personnelData.strength.available}명</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">훈련 현황</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {personnelData.training.map((training) => (
                          <div key={training.id} className="text-xs">
                            <div className="font-medium">{training.training}</div>
                            <div className="text-gray-600">
                              {training.completed}/{training.total}명 (
                              {Math.round((training.completed / training.total) * 100)}%)
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 데스크톱 좌측 사이드바 */}
      <div className="hidden lg:flex w-64 bg-gray-900 text-white flex-col">
        <div className="p-4 border-b border-gray-700">
          <Button className="w-full justify-start mb-3" variant="ghost">
            <Plus className="w-4 h-4 mr-2" />새 분석
          </Button>
          <Select
            value={currentStaffFunction}
            onValueChange={(value) => setCurrentStaffFunction(value as StaffFunction)}
          >
            <SelectTrigger className="w-full bg-gray-800 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="operations">작전과 (G-3)</SelectItem>
              <SelectItem value="logistics">군수과 (G-4)</SelectItem>
              <SelectItem value="personnel">인사과 (G-1)</SelectItem>
              <SelectItem value="admin">행정과</SelectItem>
              <SelectItem value="intelligence">정보과 (G-2)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="flex-1 p-2">
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-gray-800 cursor-pointer">
              <div className="font-medium text-sm flex items-center gap-2">
                {getStaffFunctionIcon("operations")}
                현재 임무
              </div>
              <div className="text-xs text-gray-400">작전 분석 - 오늘</div>
            </div>
            <div className="p-3 rounded-lg hover:bg-gray-800 cursor-pointer">
              <div className="font-medium text-sm flex items-center gap-2">
                {getStaffFunctionIcon("logistics")}
                보급 현황
              </div>
              <div className="text-xs text-gray-400">군수 검토 - 어제</div>
            </div>
            <div className="p-3 rounded-lg hover:bg-gray-800 cursor-pointer">
              <div className="font-medium text-sm flex items-center gap-2">
                {getStaffFunctionIcon("personnel")}
                인사 보고
              </div>
              <div className="text-xs text-gray-400">병력 분석 - 2일 전</div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-gray-700">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="w-4 h-4 mr-2" />
            설정
          </Button>
        </div>
      </div>

      {/* 메인 채팅 영역 */}
      <div className="flex-1 flex flex-col">
        {/* 헤더 */}
        <div className="border-b bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* 모바일 메뉴 버튼 */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <SheetHeader className="p-4 border-b">
                    <SheetTitle>메뉴</SheetTitle>
                  </SheetHeader>
                  <div className="p-4">
                    <div className="mb-4">
                      <Select
                        value={currentStaffFunction}
                        onValueChange={(value) => {
                          setCurrentStaffFunction(value as StaffFunction)
                          setIsMenuOpen(false)
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="operations">작전과 (G-3)</SelectItem>
                          <SelectItem value="logistics">군수과 (G-4)</SelectItem>
                          <SelectItem value="personnel">인사과 (G-1)</SelectItem>
                          <SelectItem value="admin">행정과</SelectItem>
                          <SelectItem value="intelligence">정보과 (G-2)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="p-3 rounded-lg bg-gray-100 cursor-pointer">
                        <div className="font-medium text-sm flex items-center gap-2">
                          {getStaffFunctionIcon("operations")}
                          현재 임무
                        </div>
                        <div className="text-xs text-gray-500">작전 분석 - 오늘</div>
                      </div>
                      <div className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                        <div className="font-medium text-sm flex items-center gap-2">
                          {getStaffFunctionIcon("logistics")}
                          보급 현황
                        </div>
                        <div className="text-xs text-gray-500">군수 검토 - 어제</div>
                      </div>
                      <div className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                        <div className="font-medium text-sm flex items-center gap-2">
                          {getStaffFunctionIcon("personnel")}
                          인사 보고
                        </div>
                        <div className="text-xs text-gray-500">병력 분석 - 2일 전</div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {getStaffFunctionIcon(currentStaffFunction)}
              <div>
                <h1 className="text-lg lg:text-xl font-semibold">
                  {getStaffFunctionName(currentStaffFunction)} 참모 보조
                </h1>
                <p className="text-xs lg:text-sm text-gray-600 hidden sm:block">
                  {currentStaffFunction === "operations" && "임무계획 및 전술분석"}
                  {currentStaffFunction === "logistics" && "보급, 정비, 수송 지원"}
                  {currentStaffFunction === "personnel" && "인사관리 및 손실작전"}
                  {currentStaffFunction === "admin" && "행정업무 및 공문처리"}
                  {currentStaffFunction === "intelligence" && "위협평가 및 정보분석"}
                </p>
              </div>
            </div>

            {/* 모바일 액션 버튼들 */}
            <div className="flex items-center gap-2 lg:hidden">
              <Button variant="ghost" size="sm" onClick={() => setIsMapOpen(true)}>
                <Map className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsDataOpen(true)}>
                <Package className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 채팅 메시지 영역 */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] lg:max-w-3xl ${message.type === "user" ? "bg-blue-600 text-white" : "bg-white border"} rounded-lg p-4`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === "user" ? "bg-blue-700" : "bg-gray-100"}`}
                    >
                      {message.type === "user" ? (
                        <Users className="w-4 h-4" />
                      ) : (
                        getStaffFunctionIcon(message.staffFunction)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {getStaffFunctionName(message.staffFunction)}
                        </Badge>
                        <span className="text-xs text-gray-500">{message.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm break-words">{message.content}</p>

                      {message.analysis && (
                        <div className="mt-4">
                          {renderAnalysis(message.analysis)}
                          <Badge variant="outline" className="mt-3 text-xs">
                            {message.analysis.doctrineRef}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <span className="text-sm text-gray-500 ml-2">
                      {getStaffFunctionName(currentStaffFunction)} 데이터 분석 중...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* 입력 영역 */}
        <div className="border-t bg-white p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`${getStaffFunctionName(currentStaffFunction)} 요청사항이나 데이터를 입력하세요...`}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 데스크톱 우측 사이드바 */}
      <div className="hidden lg:flex w-80 bg-white border-l flex-col">
        <div className="border-b p-4">
          <Tabs defaultValue="map">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="map" className="flex items-center gap-2">
                <Map className="w-4 h-4" />
                지도
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                데이터
              </TabsTrigger>
            </TabsList>

            <TabsContent value="map" className="mt-4">
              <div className="space-y-3">
                <div className="bg-gray-100 h-32 rounded-lg overflow-hidden relative">
                  <img src="/tactical-map-alpha.png" alt="전술지도 - 알파구역" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-xs">
                    알파구역 - 좌표 38SMB
                  </div>
                </div>
                <div className="bg-gray-100 h-32 rounded-lg overflow-hidden relative">
                  <img
                    src="/satellite-base-charlie.png"
                    alt="위성사진 - 찰리기지"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-xs">
                    찰리기지 - 위성사진
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="data" className="mt-4">
              <div className="space-y-3">
                {logisticsData.supplies.slice(0, 3).map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-sm">{item.name}</div>
                        <Badge
                          variant={
                            item.status === "adequate" ? "default" : item.status === "low" ? "secondary" : "destructive"
                          }
                          className="text-xs"
                        >
                          {getStatusText(item.status)}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        {item.quantity} {item.unit}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 모바일 모달들 */}
      <MapModal />
      <DataModal />
    </div>
  )
}
