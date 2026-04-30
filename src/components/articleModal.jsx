import { Modal, Form, Input, Select, message } from 'antd'
import { useState } from 'react'

const CreateMdal=({visible,onCancel})=>{
    const [form] = Form.useForm()
    return (
      <Modal
      title="新增知识库文章"
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose>
        //新增文章表单
        
        
      </Modal>
    )
}

export default CreateMdal
