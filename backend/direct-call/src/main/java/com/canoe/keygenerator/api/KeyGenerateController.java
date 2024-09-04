package com.canoe.keygenerator.api;

import com.canoe.keygenerator.util.CallUtil;
import com.canoe.keygenerator.util.ResultUtil;
import com.canoe.keygenerator.util.StringUtil;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.FutureTask;

import static com.canoe.keygenerator.util.ResultCode.*;

@Controller
@CrossOrigin
public class KeyGenerateController {

    @RequestMapping("/test")
    public String generate(HttpSession session, Model model){
        return "test";
    }

    @ResponseBody
    @RequestMapping("/getKey")
    public ResultUtil getKey(){
        String str = null;
        try{
            CallUtil callUtil = new CallUtil();
            FutureTask<Object> futureTask = new FutureTask(callUtil);
            new Thread(futureTask).start();
            str = futureTask.get().toString();
            Map<String, String> json = StringUtil.parseStrToJson(str);
            return ResultUtil.success(json);
        }catch (Exception e){
            e.printStackTrace();
            return ResultUtil.failure(INTERNAL_SERVER_ERROR, str);
        }


    }
}
