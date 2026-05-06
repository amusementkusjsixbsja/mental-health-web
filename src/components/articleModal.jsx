import { Modal, Form, Input, Select, message, Button, Upload, Image } from 'antd'
import { useState } from 'react'
import './articleModal.css'
import { PlusOutlined } from '@ant-design/icons'
import { uploadFile } from '@/api/admin.jsx'
import { fileUploadUrl } from '@/config/index.jsx'

const TAG_OPTIONS = [
  { label: '焦虑症', value: 'anxiety' },
  { label: '抑郁症', value: 'depression' },
  { label: '强迫症', value: 'ocd' },
  { label: '失眠', value: 'insomnia' },
  { label: '情绪管理', value: 'emotion' },
  { label: '人际关系', value: 'relationship' },
  { label: '自我成长', value: 'self-growth' },
  { label: '压力管理', value: 'stress' },
  { label: '心理咨询', value: 'counseling' },
  { label: '正念冥想', value: 'mindfulness' },
]

const ArticleModal = ({ visible, onCancel, categoryList }) => {
  const [form] = Form.useForm()
  const { TextArea } = Input

  const [previewOpen, setPreviewOpen] = useState(false)      // 控制预览弹窗开关
  const [previewImage, setPreviewImage] = useState('')       // 预览的图片地址
  const [coverFileList, setCoverFileList] = useState([])
  // 获取图片的 Base64 编码（用于本地预览）
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })

  // 预览封面图片
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
  }
  // 上传前校验 + 自定义上传
  const beforeUpload = async (file) => {
    // 1. 校验图片格式
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 格式的图片！')
      return false
    }

    // 2. 校验图片大小（限制2MB）
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB！')
      return false
    }

    // 3. 手动上传到后端
    const businessId = crypto.randomUUID()
    try {
      const res = await uploadFile(file, { businessId })
      setCoverFileList([{
        uid: businessId,
        name: file.name,
        status: 'done',
        url: fileUploadUrl + res.filePath,
      }])
    } catch (error) {
      message.error(error.message || '上传失败')
      return false
    }
    return false
  }
  // 封面上传状态改变
  const handleCoverChange = ({ fileList: newFileList }) => {
    if (newFileList.length === 0) {
      setCoverFileList([])
    }
  }
  // 自定义上传按钮
  const uploadButton = (
    <button className="cover-placeholder" type="button">
      <div >上传封面</div>
    </button>
  )
  return (
    <Modal
      title="新增知识库文章"
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose>
      <Form
        labelCol={{ span: 6, style: { textAlign: 'right' } }}
        wrapperCol={{ span: 18 }}
      >
        <Form.Item
          label="文章标题"
          name="title"
          rules={[{ required: true, message: '请输入文章标题' }]}
          className="articleModal"
        >
          {/** 文章标题 */}
          <Input placeholder="请输入文章标题" maxLength={200} showCount />
        </Form.Item>
        <Form.Item
          label="所属分类"
          name="categoryId"
          rules={[{ required: true, message: '请选择所属分类' }]}
          className="articleModal"
        >
          {/** 分类选择 */}
          <Select placeholder="请选择所属分类" options={categoryList} />
        </Form.Item>
        {/**文章摘要 */}
        <Form.Item
          label="文章摘要"
          name="summary"
          rules={[{ required: false, message: '请输入文章摘要' }]}
          className="articleModal"
        >
          <TextArea placeholder="请输入文章摘要" autoSize={{ minRows: 4, maxRows: 4 }} />
        </Form.Item>
        {/** 标签 */}
        <Form.Item
          label="标签"
          name="tags"
          rules={[{ required: false, message: '请输入标签' }]}
          className="articleModal"
        >
          <Select placeholder="请选择标签" mode="multiple" options={TAG_OPTIONS} />
        </Form.Item>
        {/** 上传封面 */}
        {/** 上传封面 一个封面图片上传*/}
        <Form.Item
          label="文章封面"
          name="cover"
          rules={[{ required: true, message: '请上传文章封面' }]}
          className="articleModal"
        >
          <div style={{ width: 200, height: 120, overflow: 'hidden' }}>
            <Upload
              listType="picture-card"
              fileList={coverFileList}
              onPreview={handlePreview}
              onChange={handleCoverChange}
              beforeUpload={beforeUpload}
              maxCount={1}
              className="cover-upload"
            >
              {coverFileList.length >= 1 ? null : uploadButton}
            </Upload>
          </div>
        </Form.Item>








        
        <Image
          style={{ display: 'none' }}
          preview={{
            open: previewOpen,
            onOpenChange: (open) => setPreviewOpen(open),
          }}
          src={previewImage}
        />

      </Form>
        <Button type="primary" htmlType="submit">新增</Button>
    </Modal>
  )
}

export default ArticleModal
