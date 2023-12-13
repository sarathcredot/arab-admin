import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Row,
  Container,
  CardHeader,
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const FormEditors = () => {
  document.title = "Form Editors | Minia - React Admin & Dashboard Template";

  const editorRef = useRef<any>();
  const [editor, setEditor] = useState(false);
  const { CKEditor, ClassicEditor }: any = editorRef.current || {};

  useEffect(() => {
      editorRef.current = {
          CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
          ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
      };
      setEditor(true);
  }, []);
  const [data, setData] = useState('');

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Forms" breadcrumbItem="Form Editors" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-1">Ckeditor Classic Editor</h4>
                  <p className="text-muted mb-0">Use <code>ckeditor-classic</code> class to set ckeditor classic editor.</p>
                </CardHeader>
                <CardBody>
                  {editor ? <CKEditor
                    editor={ClassicEditor}
                    data={data}
                    onReady={(editor: any) => {
                      // You can store the "editor" and use when it is needed.
                    }}
                    onChange={(event: any, editor: any) => {
                      const data = editor.getData();
                      setData(data);
                    }}
                  /> : <p>ckeditor5</p>}

                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default FormEditors;
