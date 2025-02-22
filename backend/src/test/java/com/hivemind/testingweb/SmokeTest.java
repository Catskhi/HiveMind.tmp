package com.hivemind.testingweb;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class SmokeTest {

    @Autowired
    private HomeController controller;

    @Test
    void contextLoads() throws Exception{
        assertThat(controller).isNotNull();
    }
}