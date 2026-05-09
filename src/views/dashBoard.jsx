import { getAnalysis } from '@/api/admin'
import PageHead from '@/components/pageHead'
import { useState, useEffect, useRef } from 'react'
import { message, Card, Col, Row } from 'antd'
import { TeamOutlined, HeartOutlined, MessageOutlined, SmileOutlined } from '@ant-design/icons'
import * as echarts from 'echarts'
import axios from 'axios'

// 仪表盘页面：后台管理主界面，展示数据
function DashBoard() {

  const [analysis, setAnalysis] = useState({})

  useEffect(() => {
    fetchAnalysis()
  }, [])

  // 获取数据
  const fetchAnalysis = async () => {
    try {
      const res = await getAnalysis({})
      setAnalysis(res || {})
    } catch (error) {
      message.error(error.message || '获取数据失败')
    }
  }

  // 初始化图表
  const moodChartRef = useRef(null)
  const sessionChartRef = useRef(null)
  const UserActivityTrendRef = useRef(null)
  // 初始化创建情绪趋势图表
  useEffect(() => {
    if (!moodChartRef.current) return
    const moodChart = echarts.init(moodChartRef.current)
    const moodTrendData = analysis.emotionTrend || []
    const option = {
      title: {
        text: '情绪趋势分析',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
        },
        left: 'center',
        top: 16,
      },
      tooltip: {
        trigger: 'axis',
        borderColor: '#f14c2fff',
        borderWidth: 1,
        textStyle: {
          fontSize: 14,
          color: '#141010ff',
        },
      },
      legend: {
        data: ['平均情绪评分', '记录数量'],
        top: 60,
      },
      grid: {
        top: 100,
        bottom: 20,
        left: '3%',
        right: '4%',
      },
      xAxis: {
        type: 'category',
        data: moodTrendData.map(item => item.date),
        axisLine: {
          lineStyle: { color: '#141010ff' },
        },
      },
      yAxis: [
        {
          type: 'value',
          name: '情绪评分',
          position: 'left',
          axisLine: {
            lineStyle: { color: '#141010ff' },
          },
        },
        {
          type: 'value',
          name: '记录数量',
          position: 'right',
          axisLine: {
            lineStyle: { color: '#141010ff' },
          },
        },
      ],
      series: [
        {
          name: '平均情绪评分',
          type: 'line',
          data: moodTrendData.map(item => item.avgMoodScore),
          smooth: true,
          lineStyle: { width: 3, color: '#fc4a1eff' },
          itemStyle: { color: '#fc4a1eff' }
        },
        {
          name: '记录数量',
          type: 'line',
          data: moodTrendData.map(item => item.recordCount),
          smooth: true,
          lineStyle: { width: 3, color: '#e2ec16ff' },
          itemStyle: { color: '#e2ec16ff' }
        },
      ],
    }
    moodChart.setOption(option)
    window.addEventListener('resize', () => moodChart.resize())
    return () => {
      moodChart.dispose()
    }
  }, [analysis])
  // 初始化咨询会话统计（柱状图 ）
  useEffect(() => {
    if (!sessionChartRef.current) return
    const sessionChart = echarts.init(sessionChartRef.current)
    const sessionData = analysis?.consultationStats?.dailyTrend || []
    //{date: "2026-04-10", sessionCount: 143, userCount: 25}
    const option = {
      title: {
        text: '咨询会话统计', 
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
        },
        left: 'center',
        top: 16,
      },
      tooltip: {
        trigger: 'axis',
        borderColor: '#26c847ff',
        borderWidth: 1,
        textStyle: {
          fontSize: 14,
          color: '#141010ff',
        },
      },
      legend: {
        data: ['咨询会话数', '用户参与数'],
        top: 60,
      },
      grid: {
        top: 100,
        bottom: 20,
        left: '3%',
        right: '4%',
      },
      xAxis: {
        type: 'category',
        data: sessionData.map(item => item.date),
        axisLine: {
          lineStyle: { color: '#141010ff' },
        },
      },
      yAxis: [
        {
          type: 'value',
          name: '咨询会话数',
          position: 'left',
          axisLine: {
            lineStyle: { color: '#141010ff' },
          },
        },
        {
          type: 'value',
          name: '用户参与数',
          position: 'right',
          axisLine: {
            lineStyle: { color: '#141010ff' },
          },
        },
      ],
      series: [
        {
          name: '咨询会话数',
          type: 'bar',
          data: sessionData.map(item => item.sessionCount),
          smooth: true,
          lineStyle: { width: 3, color: '#195ddaff' },
          itemStyle: { color: '#195ddaff' }
        },
        {
          name: '用户参与数',
          type: 'bar',
          data: sessionData.map(item => item.userCount),
          smooth: true,
          lineStyle: { width: 3, color: '#16ec68ff' },
          itemStyle: { color: '#16ec68ff' }
        },
      ],
    }
    sessionChart.setOption(option)
    window.addEventListener('resize', () => sessionChart.resize())
    return () => {
      sessionChart.dispose()
    }
  }, [analysis])
// 初始化用户活跃度（折线图 ）
  useEffect(() => {
    if (!UserActivityTrendRef.current) return
    const activityChart = echarts.init(UserActivityTrendRef.current)
    //{date: "2026-04-10", activeUsers: 25, newUsers: 38, diaryUsers: 0, consultationUsers: 25}
    const activityTrendData = analysis.userActivity || []
    const option = {
      title: {
        text: '用户活跃度趋势',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
        },
        left: 'center',
        top: 16,
      },
      tooltip: {
        trigger: 'axis',
        borderColor: '#14c2fff',
        borderWidth: 1,
        textStyle: {
          fontSize: 14,
          color: '#141010ff',
        },
      },
      legend: {
        data: ['活跃用户', '新增用户', '日记用户', '咨询用户'],
        top: 60,
      },
      grid: {
        top: 100,
        bottom: 20,
        left: '3%',
        right: '4%',
      },
      xAxis: {
        type: 'category',
        data: activityTrendData.map(item => item.date),
        axisLine: {
          lineStyle: { color: '#141010ff' },
        },
      },
      yAxis: [
        {
          type: 'value',
          name: '用户数',
          position: 'left',
          axisLine: {
            lineStyle: { color: '#141010ff' },
          },
        },
      ],
      series: [
        {
          name: '活跃用户',
          type: 'line',
          data: activityTrendData.map(item => item.activeUsers),
          smooth: true,
          lineStyle: { width: 3, color: '#b34aa5ff' },
          itemStyle: { color: '#b34aa5ff' }
        },
        {
          name: '新增用户',
          type: 'line',
          data: activityTrendData.map(item => item.newUsers),
          smooth: true,
          lineStyle: { width: 3, color: '#e8ef68ff' },
          itemStyle: { color: '#e8ef68ff' }
        },
        {
          name: '日记用户',
          type: 'line',
          data: activityTrendData.map(item => item.diaryUsers),
          smooth: true,
          lineStyle: { width: 3, color: '#68eaa3ff' },
          itemStyle: { color: '#68eaa3ff' }
        },
        {
          name: '咨询用户',
          type: 'line',
          data: activityTrendData.map(item => item.consultationUsers),
          smooth: true,
          lineStyle: { width: 3, color: '#eba25aff' },
          itemStyle: { color: '#eba25aff' }
        },
      ],
    }
    activityChart.setOption(option)
    window.addEventListener('resize', () => activityChart.resize())
    return () => {
      activityChart.dispose() 
    }
  }, [analysis])

  return (
    <div style={{ gap: 16 }}>
      <PageHead title="仪表盘" />
      <div>
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Card.Meta
                title={`总用户数: ${analysis.systemOverview?.totalUsers || '0'}`}
                description={`活跃用户数: ${analysis.systemOverview?.activeUsers || '0'}`}
                avatar={<TeamOutlined style={{ fontSize: 36, backgroundColor: '#d750e3ff', color: '#fff', padding: '4px', borderRadius: 4 }} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Card.Meta
                title={`情绪日志: ${analysis.systemOverview?.totalSessions || '0'}`}
                description={`今日新增: ${analysis.systemOverview?.todayNewSessions || '0'}`}
                avatar={<HeartOutlined style={{ fontSize: 36, backgroundColor: '#e7499aff', color: '#fff', padding: '4px', borderRadius: 4 }} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Card.Meta
                title={`咨询会话数: ${analysis.systemOverview?.totalSessions || '0'}`}
                description={`今日新增: ${analysis.systemOverview?.todayNewSessions || '0'}`}
                avatar={<MessageOutlined style={{ fontSize: 36, backgroundColor: '#34b0e6ff', color: '#fff', padding: '4px', borderRadius: 4 }} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Card.Meta
                title={`平均心情: ${analysis.systemOverview?.avgMoodScore || '0'}`}
                description={`情绪健康指南`}
                avatar={<SmileOutlined style={{ fontSize: 36, backgroundColor: '#50e3cdff', color: '#fff', padding: '4px', borderRadius: 4 }} />}
              />
            </Card>
          </Col>

        </Row>
      </div>
      <div style={{ marginTop: 16 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Card
              title='情绪趋势分析'
            >
              <div className='mood-chart'>
                <div ref={moodChartRef} style={{ height: '400px' }}></div>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title='咨询会话统计'
            >
              <div className='session-chart' style={{ height: '400px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', height: '60px' }}>
                  <div style={{ fontSize: 14, color: '#989595ff' }}>会话统计:
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#020101ff' }}>{analysis.consultationStats?.totalSessions || '0'}</div>
                  </div>
                  <div style={{ fontSize: 14, color: '#989595ff' }}>平均时长:
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#020101ff' }}>{analysis.consultationStats?.avgDurationMinutes || '0'}</div>
                  </div>
                  <div style={{ fontSize: 14, color: '#989595ff' }}>活跃用户:
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#020101ff' }}>{analysis.systemOverview?.activeUsers || '0'}</div>
                  </div>
                </div>
                <div ref={sessionChartRef} style={{ height: '340px' }}></div>
              </div>
            </Card>
          </Col>

        </Row>
      </div>
      <div style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card
            title='用户活跃度趋势'
          >
            <div ref={UserActivityTrendRef} style={{ height: '300px' }}></div>
          </Card>
        </Col>
      </div>
    </div>
  )
}

export default DashBoard
