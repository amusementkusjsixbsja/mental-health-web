import { Modal, Form, Input, Select, message, Button, Upload, Image } from 'antd'
import { useState } from 'react'
import './articleModal.css'
import { uploadFile, addArticle } from '@/api/admin.jsx'
import { fileUploadUrl } from '@/config/index.jsx'
import RichEditor from './RichEditor'
import { ControlOutlined } from '@ant-design/icons'

const TAG_OPTIONS = [
  { label: '焦虑症', value: '0' },
  { label: '抑郁症', value: '1' },
  { label: '强迫症', value: '2' },
  { label: '失眠', value: '3' },
  { label: '情绪管理', value: '4' },
  { label: '人际关系', value: '5' },
  { label: '自我成长', value: '6' },
  { label: '压力管理', value: '7' },
  { label: '心理咨询', value: '8' },
  { label: '正念冥想', value: '9' },
]

const ArticleModal = ({ visible, onCancel, categoryList }) => {
  const [form] = Form.useForm()
  const { TextArea } = Input

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [coverFileList, setCoverFileList] = useState([])
  const [contentHtml, setContentHtml] = useState('')

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
  }

  const beforeUpload = async (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 格式的图片！')
      return false
    }

    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB！')
      return false
    }

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

  const handleCoverChange = ({ fileList: newFileList }) => {
    if (newFileList.length === 0) {
      setCoverFileList([])
    }
  }

  const uploadButton = (
    <button className="cover-placeholder" type="button">
      <div >上传封面</div>
    </button>
  )

  const handleCancel = () => {
    setCoverFileList([])
    setPreviewImage('')
    setPreviewOpen(false)
    setContentHtml('')
    form.resetFields()
    onCancel()
  }

  const handleSubmit = async (values) => {
    values.content = contentHtml
    values.id = ''
    values.tags = values.tags.join(',')
    // console.log(values)
    try {
      await addArticle(values)
      message.success('新增成功')
      handleCancel()
    } catch (error) {
      message.error(error.message || '新增失败')
    }
  }

  return (
    <Modal
      title="新增知识库文章"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={720}
      destroyOnClose>
      <Form
        form={form}
        labelCol={{ span: 6, style: { textAlign: 'right' } }}
        wrapperCol={{ span: 18 }}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="文章标题"
          name="title"
          rules={[{ required: true, message: '请输入文章标题' }]}
          className="articleModal"
        >
          <Input placeholder="请输入文章标题" maxLength={200} showCount />
        </Form.Item>
        <Form.Item
          label="所属分类"
          name="categoryId"
          rules={[{ required: true, message: '请选择所属分类' }]}
          className="articleModal"
        >
          <Select placeholder="请选择所属分类" options={categoryList} />
        </Form.Item>
        <Form.Item
          label="文章摘要"
          name="summary"
          rules={[{ required: false, message: '请输入文章摘要' }]}
          className="articleModal"
        >
          <TextArea placeholder="请输入文章摘要" autoSize={{ minRows: 4, maxRows: 4 }} />
        </Form.Item>
        <Form.Item
          label="标签"
          name="tags"
          rules={[{ required: false, message: '请输入标签' }]}
          className="articleModal"
        >
          <Select placeholder="请选择标签" mode="multiple" options={TAG_OPTIONS} />
        </Form.Item>
        <Form.Item
          label="文章封面"
          name="coverImage"
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

        <Form.Item
          label="文章内容"
          rules={[{ required: true, message: '请输入文章内容' }]}
          className="articleModal"
          name="content"
        >
          <RichEditor onChange={setContentHtml} />
        </Form.Item>

        <Image
          style={{ display: 'none' }}
          preview={{
            open: previewOpen,
            onOpenChange: (open) => setPreviewOpen(open),
          }}
          src={previewImage}
        />

        <Button type="primary" htmlType="submit" >新增</Button>
      </Form>
    </Modal>
  )
}

export default ArticleModal