import { Modal, Form, Input, Select, message, Button} from 'antd'
import { useState } from 'react'
import './articleModal.css'

const CreateMdal=({visible,onCancel,categoryList})=>{
    const [form] = Form.useForm()
    const { TextArea } = Input
    return (
      <Modal
      title="新增知识库文章"
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose>
        <Form>
          <Form.Item 
          label="文章标题"
          name="title"
          rules={[{ required: true, message: '请输入文章标题' }]}
          className="articleModal"
          >
            {/** 文章标题 */}
            <Input placeholder="请输入文章标题" maxLength={200} showCount  />
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
          <TextArea placeholder="请输入文章摘要" autoSize={{ minRows: 4, maxRows: 4 }}  />
          </Form.Item>
          
        </Form>
        <Button type="primary" htmlType="submit">新增</Button>
      </Modal>
    )
}

export default CreateMdal
