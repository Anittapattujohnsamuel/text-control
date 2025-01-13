import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DocumentEditorComponent } from '@txtextcontrol/tx-ng-document-editor';
import { DocumentViewerComponent } from '@txtextcontrol/tx-ng-document-viewer';
// import { Annotation } from '@txtextcontrol/tx-ng-document-viewer';
// import { TXTextControlComponent, Annotation } from '@txtextcontrol/tx-angular';

declare const TXTextControl: any;
declare const TXDocumentViewer: any;

@Component({
  selector: 'app-text-control-app',
  templateUrl: './text-control-app.component.html',
  styleUrls: ['./text-control-app.component.css']
})
export class TextControlAppComponent implements OnInit {
  public content: string = '';  // To hold the content from the editor
  public showGridLines = true;
  public documentTargetMarkers = true;
  public editMode = '0';
  public edited = false;
  public replacedValue: any;

  private sel: any;

  // @ViewChild(DocumentEditorComponent, { static: true }) editor: DocumentEditorComponent | undefined;
  @ViewChild('document_editor')
  public documentEditor?: DocumentEditorComponent;
  @ViewChild('document_viewer')
  public documentViewer?: DocumentViewerComponent;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // TXTextControl.setEditMode(TXTextControl.EditMode.ReadAndSelect);
  }

  loadDocument() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../assets/data.docx', true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      if (xhr.status === 200) {
        var blob = xhr.response;
        var reader = new FileReader();
        reader.onload = function () {
          // get the base64 encoded string
          var data = reader?.result as string
          const base64 = data?.split(',')?.[1];
          // var encoded = btoa(data);
          // load the document
          TXTextControl.loadDocument(TXTextControl.StreamType.WordprocessingML, base64);

        };
        reader.readAsDataURL(blob);
      }
    };
    xhr.send();
    TXTextControl.setEditMode(TXTextControl.EditMode.ReadAndSelect);
  }

  loadDocumentfromLocal() {
    const inputFile = this.fileInput.nativeElement;
    if (inputFile.files && inputFile.files[0]) {
      var fileReader = new FileReader();
      //alert("1");
      fileReader.onload = function (e: any) {

        var streamType = TXTextControl.streamType.PlainText;

        // set the StreamType based on the lower case extension
        switch (inputFile.value.split('.').pop().toLowerCase()) {
          case 'doc':
            streamType = TXTextControl.streamType.MSWord;
            break;
          case 'docx':
            streamType = TXTextControl.streamType.WordprocessingML;
            break;
          case 'rtf':
            streamType = TXTextControl.streamType.RichTextFormat;
            break;
          case 'htm':
            streamType = TXTextControl.streamType.HTMLFormat;
            break;
          case 'tx':
            streamType = TXTextControl.streamType.InternalUnicodeFormat;
            break;
          case 'pdf':
            streamType = TXTextControl.streamType.AdobePDF;
            break;
          case 'xml':
            alert('xml');
            streamType = TXTextControl.streamType.WordprocessingML;
            break;
        }
        //alert(streamType);
        // load the document beginning at the Base64 data (split at comma)
        TXTextControl.loadDocument(streamType, e.target.result.split(',')[1]);
        TXTextControl.setEditMode(TXTextControl.EditMode.ReadAndSelect);
      };

      // read the file and convert it to Base64
      fileReader.readAsDataURL(inputFile.files[0]);
    }
  }

  async savePDFDocument() {
    TXTextControl.saveDocument(TXTextControl.StreamType.AdobePDF, function (e: any) {
      const bDocument = e.data;
      // create temporary link to download document
      var element = document.createElement('a');
      element.setAttribute('href', 'data:application/octet-stream;base64,' + bDocument);
      element.setAttribute('download', "results.pdf");

      element.style.display = 'none';
      document.body.appendChild(element);

      // simulgncate click
      element.click();

      // remove the link
      document.body.removeChild(element);
    });
  }

  async saveDocument() {
    TXTextControl.saveDocument(TXTextControl.StreamType.WordprocessingML, function (e: any) {
      const base64Data = e.data.split(',')[1];  // Remove data URI prefix if present

      // Decode the base64 string
      const byteCharacters = atob(e.data);  // Decodes the base64 string to byte characters

      // Convert the byte characters to an array of byte values
      const byteArrays = [];
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i));  // Push byte-by-byte into the array
      }

      // Create a Uint8Array from the byte array
      const byteArray = new Uint8Array(byteArrays);

      // Create a Blob from the byte array and set the MIME type for a Word document
      const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

      // Create a link element to trigger the download
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);  // Create a URL for the Blob

      link.href = url;
      link.download = 'document.docx';  // Set the default filename for the Word document
      link.click();  // Simulate the click to trigger the download

      // Clean up the created URL to release memory
      URL.revokeObjectURL(url);
    });
  }

  createElement() {
    this.createTable();
  }

  createTable() {
    let textField = new TXTextControl.TextField("I am a NON EDITABLE TEXT FIELD. A non-editable text box, also known as a read-only text box, is a user interface element that displays text which cannot be modified by the user. This type of text box is commonly used in applications and websites to present information that needs to be viewed but not altered. For example, non-editable text boxes are often used to display terms and conditions, user information, or system-generated data that should remain unchanged. The primary purpose of a non-editable text box is to ensure the integrity and consistency of the displayed information, preventing accidental or unauthorized modifications..\n");
    textField.editable = false;
    // TXTextControl.editableRegions.highlightMode = 1;

    TXTextControl.addTextField(textField);

    var html = "<p disabled='true' idea='xblridea' style='background-color:blue'> This is some <b style='color:red'>editable Text</b> text.  An editable text field is a user interface element that allows users to input and modify text. It is commonly used in forms, applications, and websites to collect user data. Editable text fields are a fundamental component of user interfaces, providing a flexible and interactive way for users to communicate with digital systems.: Links work as<a href='http://mail.yahoo.com'> yahoo mail</a> </p>";
    var encoded = btoa(html); // btoa base-64-encodes strings.
    TXTextControl.appendDocument(TXTextControl.StreamType.HTMLFormat, encoded);

    let textField2 = new TXTextControl.TextField("I am a NON EDITABLE TEXT.Non-editable text boxes are particularly useful in forms where certain fields need to be pre-filled with data that should not be changed by the user. For example, in an order confirmation form, the user's name and address might be displayed in non-editable text boxes to prevent any changes after the order has been placed. This ensures that the information remains accurate and consistent throughout the process. Moreover, non-editable text boxes can be used to display calculated values or results generated by the system, such as the total price of items in a shopping cart or the output of a mathematical calculation.");
    // textField2.editable = true;
    // TXTextControl.addTextField(textField2);
    let mergeField = new TXTextControl.MergeField();
    mergeField.text = "I am a merge field";
    mergeField.name = '[[mergeField]]';
    mergeField.highlightColor = "rgba(9, 165, 2, 0.3)";
    TXTextControl.addMergeField(mergeField);
    // TXTextControl.highlightColor('blue');
    // const editable=new TXTextControl.EditableRegion();
    // editable.setHighlightMode(TXTextControl.HighlightMode.Highlight);
    // TXTextControl.appendDocument(TXTextControl.StreamType.HTMLFormat,  btoa(mergeField));
  }

  selectText() {
    this.sel = TXTextControl.selection;
    this.edited = true;
    this.ref.detectChanges();
    setTimeout(() => {
      this.sel.editable = false;
      this.sel.getText((x: any) => {
        this.replacedValue = x;
        this.ref.detectChanges();
      });

    }, 150)
  }

  addExpression() {
    this.sel.setForeColor("BLUE");
    this.sel.setFontSize(18);
    this.sel.setText(this.replacedValue);
    TXTextControl.setEditMode(TXTextControl.EditMode.ReadAndSelect);
    // TXTextControl.textFrames.setLocation(0);
    this.edited = false;
    // var annotations = TXDocumentViewer.annotations.export();
    // this.sel.addAnnotation(new annotations({
    //   text: 'XBRL tag',
    //   metadata: { tag: '"Description of Tag 1 related to XBRL' }
    // }));
    // TXTextControl.applicationFields.add(
    //   TXTextControl.ApplicationFieldFormat.HighEdit,
    //   "MERGEFIELD",
    //   'PLACE',
    //   ['name'],
    //   (af: any) => {
    //     var highlightColor = "rgba(9, 165, 2, 0.3)";
    //     var highlightMode = TXTextControl.HighlightMode.Always;

    //     af.setHighlightColor(highlightColor);
    //     af.setHighlightMode(highlightMode);
    //     af.setDoubledInputPosition(true);
    //   }
    // );
    this.ref.detectChanges()
  }

  viewMode() {
    TXTextControl.setEditMode(TXTextControl.EditMode.ReadOnly);
    this.ref.detectChanges();
  }

  editDocMode() {
    TXTextControl.setEditMode(TXTextControl.EditMode.Edit);
    this.ref.detectChanges();
  }



}

