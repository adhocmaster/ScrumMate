import ContentBox from "../common/ContentBox";
import { TextField } from "@mui/material";

export default function LockableTextBox({lockPage, text, editText}) {
    return lockPage ?
        < ContentBox title={"Problem Statement"} content={text} />
        :
        <TextField
            sx={{
                margin: '5px 10px',
                height: "130px",
            }}
            minRows={4}
            maxRows={4}
            style={{ width: "98%" }}
            value={text}
            onChange={editText}
            multiline

        />
}