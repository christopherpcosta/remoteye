using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using Newtonsoft.Json;

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
                System.IO.File.Copy(@"C:\Output\output.txt", @"C:\Output\outputTemporary.txt", true);
                var response = System.IO.File.ReadLines(@"C:\Output\outputTemporary.txt");

                var newResponse = new List<string>();

                var originalArray = response.ToArray();

                for (var i = response.Count() - 60; i < response.Count(); i++)
                {
                    newResponse.Add(originalArray[i]);
                }

                return JsonConvert.SerializeObject(newResponse);
            }
            catch (Exception e)
            {
                return null;
            }


        }
    }
}
