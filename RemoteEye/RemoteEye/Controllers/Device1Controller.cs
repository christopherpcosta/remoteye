using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using Newtonsoft.Json;
using System.Text;

namespace RemoteEye.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class Device1Controller : ControllerBase
    {
        private readonly ILogger<Device1Controller> _logger;

        public Device1Controller(ILogger<Device1Controller> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public string Get()
        {
            try
            {          
                FileStream fs = new FileStream(@"C:\Output\output.txt", FileMode.Open, FileAccess.Read, FileShare.ReadWrite);

                var buffer = new byte[4000];
                fs.Seek(-4000, SeekOrigin.End);
                fs.Read(buffer, 0, 4000);

                return JsonConvert.SerializeObject(Encoding.UTF8.GetString(buffer.Where(p => p != 0).ToArray()));
            }
            catch (Exception e)
            {
                return JsonConvert.SerializeObject(e.Message);
            }
        }
    }
}
