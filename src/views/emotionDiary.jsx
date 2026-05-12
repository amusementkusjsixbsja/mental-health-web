import '@/views/emotionDiary.css'
import { HeartOutlined } from '@ant-design/icons';
import { Rate, Input, Select, Button, message } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import { createOrUploadEmotionDiary } from '@/api/admin.jsx'
const { TextArea } = Input;

const emotionTexts = [
  '极度抑郁',
  '非常低落',
  '沮丧难过',
  '略显低落',
  '心情平静',
  '还算不错',
  '愉悦开心',
  '非常快乐',
  '兴奋激动',
  '极致幸福',
];

const EmotionIcons = {
  happy: '😊',
  sad: '😢',
  angry: '😡',
  surprised: '😲',
  fearful: '😨',
  disgusted: '🤢',
  neutral: '😐',
  anxious: '😰',
};

function EmotionDiary() {
  const [diaryForm, setDiaryForm] = useState({
    diaryDate: dayjs().format('YYYY-MM-DD'),
    moodScore: null,//int
    dominantEmotion: '',//string
    emotionTriggers: '',//string
    diaryContent: '',//string
    sleepQuality: null,//int
    stressLevel: null,//int
  });

  const [selectedEmotion, setSelectedEmotion] = useState('');

  const handleMoodScoreChange = (value) => {
    setDiaryForm(prev => ({
      ...prev,
      moodScore: value
    }))
  }

  const handleEmotionChange = (emotion) => {
    setSelectedEmotion(emotion);
    setDiaryForm(prev => ({
      ...prev,
      dominantEmotion: emotion
    }))
  }

  const handleSleepQualityChange = (value) => {
    setDiaryForm(prev => ({
      ...prev,
      sleepQuality: value
    }))
  }

  const handlePressureChange = (value) => {
    setDiaryForm(prev => ({
      ...prev,
      stressLevel: value
    }))
  }

  const resetForm = () => {
    setSelectedEmotion(''); // 重置选中状态
    setDiaryForm({
      diaryDate: dayjs().format('YYYY-MM-DD'),
      moodScore: null,
      dominantEmotion: '',
      emotionTriggers: '',
      diaryContent: '',
      sleepQuality: null,
      stressLevel: null,
    })
  }
  const handleSubmit = () => {
    // 先构建提交数据
    const submitData = {
      ...diaryForm,
      moodScore: diaryForm.moodScore || null,
      dominantEmotion: diaryForm.dominantEmotion || '',
      sleepQuality: diaryForm.sleepQuality || null,
      stressLevel: diaryForm.stressLevel || null,
      emotionTriggers: diaryForm.emotionTriggers || '',
      diaryContent: diaryForm.diaryContent || '',
    }

    // 然后验证必填项
    if (submitData.moodScore == null || submitData.moodScore < 1) {
      message.error('请选择情绪评分');
      return;
    }

    if (submitData.dominantEmotion === '') {
      message.error('请选择主要情绪');
      return;
    }
    console.log(submitData);
    // 提交数据
    createOrUploadEmotionDiary(submitData)
      .then(() => {
        message.success('提交成功');
        resetForm();
      })
      .catch((error) => {
        console.error('提交失败:', error);
        message.error('提交失败');
      })
  }

  return (
    <div className='emotion-diary-container'>
      <div className='emotion-diary-header'>
        <div className='header-content'>
          <HeartOutlined className='header-icon' />
          <h1 className='header-title'>情绪日记</h1>
        </div>
      </div>
      <div className='emotion-diary-content'>
        {/* 情绪评分 */}
        <div className='emotion-diary-content-card'>
          <div className='card-title'>情绪评分</div>
          <div className='card-section'>
            <p>今天的情绪怎么样？打个分吧（1-10）</p>
            <div className='rate'>
              <Rate
                count={10}
                value={diaryForm.moodScore}
                tooltips={emotionTexts}
                onChange={handleMoodScoreChange}
              />
              {diaryForm.moodScore > 0 && (
                <span className="rate-text">
                  {emotionTexts[diaryForm.moodScore - 1]}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 主要情绪 */}
        <div className='emotion-diary-content-card'>
          <div className='card-title'>主要情绪</div>
          <div className="emotion-grid">
            {Object.entries(EmotionIcons).map(([emotion, icon]) => (
              <div
                key={emotion}
                className={`emotion-item ${selectedEmotion === emotion ? 'selected' : ''}`}
                onClick={() => handleEmotionChange(emotion)}
              >
                <div className="emotion-icon">{icon}</div>
                <span className="emotion-label">{emotion}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 详细记录 */}
        <div className='emotion-diary-content-card'>
          <div className='card-title'>详细记录</div>
          <div className='detail-form'>
            <div className='form-group'>
              <div className='form-label'>情绪触发因素</div>
              <TextArea
                placeholder="请输入情绪触发因素"
                rows={3}
                maxLength={1000}
                showCount
                value={diaryForm.emotionTriggers}
                onChange={(e) => setDiaryForm(prev => ({ ...prev, emotionTriggers: e.target.value }))}
              />
            </div>
            <div className='form-group'>
              <div className='form-label'>今日感想</div>
              <TextArea
                placeholder="请输入今日感想"
                rows={4}
                maxLength={2000}
                showCount
                value={diaryForm.diaryContent}
                onChange={(e) => setDiaryForm(prev => ({ ...prev, diaryContent: e.target.value }))}
              />
            </div>

            {/* 生活指标 */}
            <div className='life-indicators'>
              <div className='indicator-group'>
                <div className='form-label'>睡眠质量</div>
                <Select
                  style={{ width: 120 }}
                  value={diaryForm.sleepQuality}
                  onChange={handleSleepQualityChange}
                  options={[
                    { value: '5', label: '很好' },
                    { value: '4', label: '好' },
                    { value: '3', label: '一般' },
                    { value: '2', label: '差' },
                    { value: '1', label: '很差' },
                  ]}
                />
              </div>
              <div className='indicator-group'>
                <div className='form-label'>压力水平</div>
                <Select
                  style={{ width: 120 }}
                  value={diaryForm.stressLevel}
                  onChange={handlePressureChange}
                  options={[
                    { value: '1', label: '很低' },
                    { value: '2', label: '低' },
                    { value: '3', label: '中等' },
                    { value: '4', label: '高' },
                    { value: '5', label: '很高' },
                  ]}
                />
              </div>
            </div>

            {/* 提交按钮 */}
            <div className='button-group'>
              <Button type="primary" onClick={handleSubmit}>提交</Button>
              <Button type="default" onClick={resetForm} style={{ marginLeft: 8 }}>重置</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmotionDiary;